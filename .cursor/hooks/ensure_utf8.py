#!/usr/bin/env python3
"""Convierte a UTF-8 archivos de texto con BOM UTF-16 o bytes nulos."""

from __future__ import annotations

import json
import sys
from pathlib import Path

TEXT_SUFFIXES = {
    ".py",
    ".pyi",
    ".json",
    ".md",
    ".toml",
    ".yml",
    ".yaml",
    ".ini",
    ".cfg",
    ".txt",
    ".csv",
    ".env",
    ".sql",
    ".html",
    ".css",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
}


def decode_with_nuls(raw: bytes) -> str | None:
    if not raw or b"\x00" not in raw:
        return None
    if raw.startswith(b"\xff\xfe"):
        return raw.decode("utf-16-le")
    if raw.startswith(b"\xfe\xff"):
        return raw.decode("utf-16-be")
    for encoding in ("utf-16-le", "utf-16-be", "utf-16"):
        try:
            return raw.decode(encoding)
        except UnicodeDecodeError:
            continue
    return raw.decode("utf-8", errors="ignore").replace("\x00", "")


def fix_file(path: Path) -> bool:
    if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
        return False
    raw = path.read_bytes()
    text = decode_with_nuls(raw)
    if text is None:
        return False
    path.write_text(text, encoding="utf-8", newline="\n")
    return True


def scan_roots(roots: list[str]) -> int:
    fixed = 0
    for root in roots:
        base = Path(root)
        if not base.is_dir():
            continue
        for path in base.rglob("*"):
            if path.suffix.lower() in TEXT_SUFFIXES and fix_file(path):
                fixed += 1
    return fixed


def main() -> int:
    if len(sys.argv) > 1:
        targets = [Path(arg) for arg in sys.argv[1:]]
        for target in targets:
            if target.is_dir():
                scan_roots([str(target)])
            else:
                fix_file(target)
        return 0

    raw_stdin = sys.stdin.read() if not sys.stdin.isatty() else ""
    payload: dict = {}
    if raw_stdin.strip():
        try:
            payload = json.loads(raw_stdin)
        except json.JSONDecodeError:
            payload = {}

    file_path = payload.get("file_path")
    if file_path:
        fix_file(Path(file_path))
        return 0

    roots = payload.get("workspace_roots") or [str(Path.cwd())]
    scan_roots(roots)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
