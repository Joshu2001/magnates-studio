"""Regaarder Studio AI Harness Runner & 4x Verification Suite.

Spins up the Express server on an isolated port, exercises every AI Harness API
step, verifies EVERY step 4 times sequentially, and then runs a final
simultaneous verification of all steps concurrently.
"""

from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import os
import socket
import subprocess
import sys
import tempfile
import time
import urllib.error
import urllib.request

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STUDIO_DIR = os.path.join(ROOT_DIR, "magnates-studio")


def get_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def http_json(base_url: str, path: str, method: str = "GET", body: dict = None) -> dict:
    url = f"{base_url}{path}"
    data = json.dumps(body).encode("utf-8") if body is not None else None
    headers = {"Content-Type": "application/json"} if body is not None else {}
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    with urllib.request.urlopen(req, timeout=10) as resp:
        return json.loads(resp.read().decode("utf-8"))


def wait_for_server(base_url: str, timeout_s: float = 10.0) -> None:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        try:
            res = http_json(base_url, "/api/ai/tools")
            if res.get("ok"):
                return
        except Exception:
            time.sleep(0.2)
    raise RuntimeError(f"Server did not become ready at {base_url}")


def step_1_manifest(base_url: str, suffix: str) -> None:
    res = http_json(base_url, "/api/ai/tools")
    assert res["ok"] and res["totalTools"] >= 20, "Manifest missing tools"
    names = {t["name"] for t in res["tools"]}
    for req_tool in ("create_template", "calibrate_3d_volume", "sculpt_3d_point", "add_scene", "add_layer"):
        assert req_tool in names, f"Missing tool {req_tool}"


def step_2_create_template(base_url: str, suffix: str) -> None:
    tpl_id = f"ai-harness-tpl-{suffix}"
    res = http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "create_template",
        "args": {"id": tpl_id, "name": f"AI Template {suffix}", "category": "3D Spatial", "duration": 12},
    })
    assert res["ok"] and res["result"]["template"]["id"] == tpl_id


def step_3_list_and_update_template(base_url: str, suffix: str) -> None:
    tpl_id = f"ai-harness-tpl-{suffix}"
    http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "create_template",
        "args": {"id": tpl_id, "name": "Initial Name"},
    })
    upd = http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "update_template",
        "args": {"id": tpl_id, "patch": {"name": f"Updated {suffix}"}},
    })
    assert upd["ok"] and upd["result"]["template"]["name"] == f"Updated {suffix}"
    lst = http_json(base_url, "/api/ai/execute", "POST", {"tool": "list_templates", "args": {}})
    assert any(t["id"] == tpl_id for t in lst["result"]["templates"])


def step_4_project_scene_layer(base_url: str, suffix: str) -> None:
    sc = http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "add_scene",
        "args": {"title": f"AI Scene {suffix}", "duration": 9},
    })
    assert sc["ok"] and sc["result"]["scene"]["title"] == f"AI Scene {suffix}"
    ly = http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "add_layer",
        "args": {"id": f"layer_{suffix}", "type": "object3d", "src": "/assets/boot.png"},
    })
    assert ly["ok"] and ly["result"]["layer"]["id"] == f"layer_{suffix}"
    st = http_json(base_url, "/api/ai/execute", "POST", {"tool": "get_project_state", "args": {}})
    assert st["ok"] and f"layer_{suffix}" in st["result"]["state"]["layers"]


def step_5_client_3d_bridge(base_url: str, suffix: str) -> None:
    q = http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "calibrate_3d_volume",
        "args": {"roundness": 0.9, "shapePreset": "shoe", "mirrorMode": "symmetric"},
    })
    assert q["ok"] and q["status"] == "queued"
    cmd_id = q["commandId"]
    pending = http_json(base_url, "/api/ai/commands/pending")
    assert any(c["id"] == cmd_id for c in pending["commands"])
    done = http_json(base_url, f"/api/ai/commands/{cmd_id}/result", "POST", {
        "ok": True,
        "result": {"calibrated": True, "suffix": suffix},
    })
    assert done["ok"] and done["command"]["status"] == "done"


def step_6_batch_pipeline(base_url: str, suffix: str) -> None:
    res = http_json(base_url, "/api/ai/batch", "POST", {
        "steps": [
            {"tool": "create_template", "args": {"id": f"batch-{suffix}", "name": f"Batch {suffix}"}},
            {"tool": "set_dimension_mode", "args": {"mode": "3d"}},
            {"tool": "sculpt_3d_point", "args": {"u": 0.25, "v": 0.35, "delta": -0.2}},
            {"tool": "delete_template", "args": {"id": f"batch-{suffix}"}},
        ]
    })
    assert res["ok"] and res["completedSteps"] == 4


def step_7_media_and_cleanup(base_url: str, suffix: str) -> None:
    med = http_json(base_url, "/api/ai/execute", "POST", {"tool": "list_media", "args": {}})
    assert med["ok"] and isinstance(med["result"]["files"], list)
    d = http_json(base_url, "/api/ai/execute", "POST", {
        "tool": "delete_template",
        "args": {"id": f"ai-harness-tpl-{suffix}"},
    })
    assert d["ok"]


STEPS = [
    ("Step 1: Tool Manifest Discovery", step_1_manifest),
    ("Step 2: Template Creation", step_2_create_template),
    ("Step 3: Template List & Update", step_3_list_and_update_template),
    ("Step 4: Project, Scene & Layer", step_4_project_scene_layer),
    ("Step 5: Client 3D & Sculpt Bridge", step_5_client_3d_bridge),
    ("Step 6: Batch Pipeline", step_6_batch_pipeline),
    ("Step 7: Media & Cleanup", step_7_media_and_cleanup),
]


def main() -> None:
    port = get_free_port()
    base_url = f"http://127.0.0.1:{port}"

    with tempfile.TemporaryDirectory() as tmp_dir:
        env = {**os.environ, "PORT": str(port), "AI_HARNESS_DATA_DIR": tmp_dir}
        proc = subprocess.Popen(
            ["node", "server.js"],
            cwd=STUDIO_DIR,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        try:
            wait_for_server(base_url)

            # 4x sequential verification of every single step
            for round_num in range(1, 5):
                for name, fn in STEPS:
                    fn(base_url, f"r{round_num}")
                print(f"[PASS] Verification Round {round_num}/4: all {len(STEPS)} steps passed.")

            # Final simultaneous verification of all steps concurrently
            with ThreadPoolExecutor(max_workers=len(STEPS)) as pool:
                futures = {pool.submit(fn, base_url, f"sim_{idx}"): name for idx, (name, fn) in enumerate(STEPS)}
                for fut in as_completed(futures):
                    fut.result()
            print(f"[PASS] Final Simultaneous Verification: all {len(STEPS)} steps passed concurrently.")
        finally:
            proc.terminate()
            proc.wait(timeout=5)


if __name__ == "__main__":
    main()
