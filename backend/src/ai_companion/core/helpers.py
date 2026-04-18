"""Utility functions for the AI companion."""

def clean_env_var(s: str) -> str:
    """Clean environment variables by removing non-printable characters and whitespace"""
    return ''.join(c for c in s if c.isprintable() and c not in ['\r', '\n', '\t'])
