import os
import json
import sys
from pathlib import Path
from datetime import datetime

def should_exclude_item(item_name, is_directory=False):
    """
    Check if an item should be excluded from scanning
    """
    # Common directories to exclude
    excluded_directories = {
        'node_modules', '.git', '__pycache__', '.vscode', '.idea',
        'build', 'dist', '.next', '.nuxt', 'coverage', '.pytest_cache',
        '.mypy_cache', '.sass-cache', '.cache', 'vendor', '.env',
        '.terraform', '.vagrant', 'bower_components', '.tox',
        'venv', 'env', '.venv', '.virtualenv', 'site-packages',
        '.gradle', 'target', 'bin', 'obj', '.vs', 'Debug', 'Release',
        'CMakeFiles', '.cmake', 'logs', 'tmp', 'temp', '.tmp',
        'Thumbs.db', '.Spotlight-V100', '.Trashes', '.fseventsd'
    }

    # Common file patterns to exclude
    excluded_file_patterns = {
        '.pyc', '.pyo', '.pyd', '.so', '.dylib', '.dll',
        '.DS_Store', '.env', '.log', '.tmp', '.swp', '.bak',
        '.cache', '.pid', '.lock', '.sqlite', '.db',
        'Thumbs.db', 'desktop.ini', '.gitignore', '.gitkeep',
        '.npmignore', '.dockerignore', '.editorconfig',
        '.eslintrc', '.prettierrc', '.babelrc'
    }

    # Check if it's a hidden file/directory (starts with .)
    if item_name.startswith('.') and item_name not in {'.env', '.gitignore', '.gitkeep'}:
        allowed_hidden = {
            '.htaccess', '.editorconfig', '.prettierrc', '.eslintrc.js',
            '.eslintrc.json', '.babelrc', '.dockerignore', '.npmignore'
        }
        if item_name not in allowed_hidden:
            return True

    if is_directory:
        return item_name.lower() in excluded_directories
    else:
        # Check file extensions and exact names
        file_lower = item_name.lower()

        if file_lower in excluded_file_patterns:
            return True

        # Check file extensions
        if '.' in item_name:
            extension = '.' + item_name.split('.')[-1].lower()
            if extension in excluded_file_patterns:
                return True

        # Check for backup/temp files
        if item_name.endswith('~') or item_name.startswith('~') or item_name.startswith('#'):
            return True

    return False

def get_file_stats(file_path):
    """Get file size in human readable format"""
    try:
        size = os.path.getsize(file_path)
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024.0:
                return f"{size:.1f}{unit}"
            size /= 1024.0
        return f"{size:.1f}TB"
    except:
        return "0B"

def scan_directory(root_path, include_stats=False):
    tree_lines = []
    file_types = {}
    total_size = 0

    def build_structure(current_path, prefix=""):
        nonlocal total_size
        structure = {
            "name": os.path.basename(current_path),
            "type": "directory",
            "children": []
        }

        try:
            items = sorted(os.listdir(current_path))
        except PermissionError:
            return structure

        # Filter out excluded items
        filtered_items = []
        for item in items:
            item_path = os.path.join(current_path, item)
            is_dir = os.path.isdir(item_path)
            is_file = os.path.isfile(item_path)

            if (is_dir or is_file) and not should_exclude_item(item, is_dir):
                filtered_items.append(item)

        dirs = [item for item in filtered_items if os.path.isdir(os.path.join(current_path, item))]
        files = [item for item in filtered_items if os.path.isfile(os.path.join(current_path, item))]

        # Sort directories first, then files
        all_items = sorted(dirs) + sorted(files)

        for i, item in enumerate(all_items):
            is_last = i == len(all_items) - 1
            connector = "└── " if is_last else "├── "
            item_path = os.path.join(current_path, item)

            if item in dirs:
                tree_lines.append(f"{prefix}{connector}{item}/")
                next_prefix = prefix + ("    " if is_last else "│   ")
                child_structure = build_structure(item_path, next_prefix)
                structure["children"].append(child_structure)
            else:
                # Track file types
                ext = os.path.splitext(item)[1].lower()
                if ext:
                    file_types[ext] = file_types.get(ext, 0) + 1

                # Get file size
                size_str = ""
                if include_stats:
                    size = os.path.getsize(item_path)
                    total_size += size
                    size_str = f" ({get_file_stats(item_path)})"

                tree_lines.append(f"{prefix}{connector}{item}{size_str}")
                structure["children"].append({
                    "name": item,
                    "type": "file",
                    "size": size_str.strip("() ") if size_str else None
                })

        return structure

    tree_lines.append(f"{os.path.basename(root_path)}/")
    structure = build_structure(root_path)

    return structure, tree_lines, file_types, total_size

def create_trading_report(scan_path):
    """Create a special report for Trading Mastery project"""
    report_lines = []
    report_lines.append("=" * 60)
    report_lines.append("TRADING MASTERY PROJECT STRUCTURE REPORT")
    report_lines.append("=" * 60)
    report_lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report_lines.append(f"Root Path: {scan_path}")
    report_lines.append("")

    # Check for key directories
    key_dirs = {
        "TradingPracticeHub": "✅ Practice Hub Found",
        "01_Education": "✅ Education Materials",
        "02_Daily_Operations": "✅ Daily Operations",
        "03_Trading_Journal": "✅ Trading Journal",
        "04_Strategies": "✅ Strategy Documentation",
        "05_Technical_Analysis": "✅ Technical Analysis",
        "06_Risk_Management": "✅ Risk Management",
        "07_Performance_Tracking": "✅ Performance Tracking",
        "08_Tools_Resources": "✅ Tools & Resources",
        "09_Psychology": "✅ Psychology Resources",
        "10_Communication_Claude": "✅ Claude Communication"
    }

    report_lines.append("KEY COMPONENTS CHECK:")
    for dir_name, message in key_dirs.items():
        dir_path = scan_path / dir_name
        if dir_path.exists():
            report_lines.append(f"  {message}")
        else:
            report_lines.append(f"  ❌ Missing: {dir_name}")

    # Check for important files
    report_lines.append("\nCRITICAL FILES CHECK:")
    critical_files = [
        "MASTER_TRADING_PLAN.json",
        "PHASE_TRACKER.json",
        "QUICK_REFERENCE_CARD.md",
        "README.md"
    ]

    for file_name in critical_files:
        file_path = scan_path / file_name
        if file_path.exists():
            report_lines.append(f"  ✅ {file_name}")
        else:
            report_lines.append(f"  ❌ Missing: {file_name}")

    # Check Trading Practice Hub
    hub_path = scan_path / "TradingPracticeHub"
    if hub_path.exists():
        report_lines.append("\nTRADING PRACTICE HUB STATUS:")
        hub_checks = {
            "index.html": "Main entry point",
            "css": "Stylesheets directory",
            "js": "JavaScript directory",
            "data": "Data directory",
            "assets": "Assets directory"
        }

        for item, desc in hub_checks.items():
            item_path = hub_path / item
            if item_path.exists():
                report_lines.append(f"  ✅ {item} - {desc}")
            else:
                report_lines.append(f"  ❌ Missing: {item} - {desc}")

    return "\n".join(report_lines)

def create_output_files(scan_path=None):
    # If no path provided, use current directory
    if scan_path is None:
        scan_path = Path.cwd()
    else:
        scan_path = Path(scan_path).absolute()

    if not scan_path.exists():
        print(f"❌ Directory '{scan_path}' not found!")
        return

    print(f"🔍 Scanning: {scan_path}")
    print("⏳ Processing...")

    # Save output files in the scanned directory
    output_dir = scan_path / "_directory_analysis"
    output_dir.mkdir(exist_ok=True)

    # Scan with statistics
    structure, tree_lines, file_types, total_size = scan_directory(scan_path, include_stats=True)

    # Create timestamp for filenames
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    # tree.txt
    tree_file = output_dir / f"tree_{timestamp}.txt"
    with open(tree_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(tree_lines))

    # structure.json
    json_file = output_dir / f"structure_{timestamp}.json"
    with open(json_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, indent=2)

    # structure.min.json
    min_json_file = output_dir / f"structure_{timestamp}.min.json"
    with open(min_json_file, 'w', encoding='utf-8') as f:
        json.dump(structure, f, separators=(',', ':'))

    # Count items
    def count_items(node):
        dirs = files = 0
        for child in node.get("children", []):
            if child["type"] == "directory":
                dirs += 1
                sub_dirs, sub_files = count_items(child)
                dirs += sub_dirs
                files += sub_files
            else:
                files += 1
        return dirs, files

    dirs, files = count_items(structure)

    # Create summary report
    summary_lines = []
    summary_lines.append("DIRECTORY SCAN SUMMARY")
    summary_lines.append("=" * 40)
    summary_lines.append(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    summary_lines.append(f"Root Path: {scan_path}")
    summary_lines.append(f"Total Directories: {dirs:,}")
    summary_lines.append(f"Total Files: {files:,}")
    summary_lines.append(f"Total Size: {get_file_stats(total_size)}")
    summary_lines.append("\nFILE TYPE BREAKDOWN:")

    # Sort file types by count
    sorted_types = sorted(file_types.items(), key=lambda x: x[1], reverse=True)
    for ext, count in sorted_types[:20]:  # Top 20 file types
        summary_lines.append(f"  {ext if ext else 'no extension':15} {count:5} files")

    if len(sorted_types) > 20:
        summary_lines.append(f"  ... and {len(sorted_types) - 20} more types")

    summary_file = output_dir / f"summary_{timestamp}.txt"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(summary_lines))

    # Special report for Trading Mastery
    if "TradingMastery" in str(scan_path):
        report = create_trading_report(scan_path)
        report_file = output_dir / f"trading_mastery_report_{timestamp}.txt"
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write(report)
        print(f"✅ Created: trading_mastery_report_{timestamp}.txt")

    print("\n✅ SCAN COMPLETE!")
    print(f"📁 Output saved to: {output_dir}")
    print(f"📊 Stats: {dirs:,} directories, {files:,} files")
    print(f"💾 Total size: {get_file_stats(total_size)}")
    print("\nCreated files:")
    print(f"  - tree_{timestamp}.txt")
    print(f"  - structure_{timestamp}.json")
    print(f"  - structure_{timestamp}.min.json")
    print(f"  - summary_{timestamp}.txt")

def main():
    print("🚀 Trading Mastery Directory Scanner")
    print("=" * 40)

    if len(sys.argv) > 1:
        target_path = sys.argv[1]
    else:
        # Ask user for path
        print("\nOptions:")
        print("1. Scan current directory")
        print('2. Scan Trading Mastery root ("C:\\Dev\\trading-mastery")')
        print("3. Enter custom path")

        choice = input("\nChoice (1-3): ").strip()

        if choice == "1":
            target_path = None
        elif choice == "2":
            target_path = "C:/Dev/TradingMastery"
        elif choice == "3":
            target_path = input("Enter path: ").strip()
        else:
            print("Invalid choice!")
            return

    create_output_files(target_path)

if __name__ == "__main__":
    main()
