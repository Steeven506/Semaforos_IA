COLORS = {
    "bg_primary": "#0f172a",
    "bg_secondary": "#1e293b",
    "bg_tertiary": "#334155",
    "bg_card": "#1e293b",
    "border": "#475569",
    "border_light": "#64748b",
    "text_primary": "#f1f5f9",
    "text_secondary": "#cbd5e1",
    "text_muted": "#94a3b8",
    "accent_blue": "#3b82f6",
    "accent_green": "#10b981",
    "accent_red": "#ef4444",
    "accent_yellow": "#f59e0b",
    "accent_purple": "#8b5cf6",
    "accent_cyan": "#06b6d4"
}

GLOBAL_STYLE = f"""
    QMainWindow {{
        background-color: {COLORS['bg_primary']};
    }}
    QWidget {{
        color: {COLORS['text_primary']};
        font-family: 'Segoe UI', Arial, sans-serif;
    }}
    QLabel {{
        color: {COLORS['text_primary']};
        background: transparent;
    }}
    QLabel#title {{
        font-size: 28px;
        font-weight: bold;
        color: {COLORS['accent_blue']};
    }}
    QLabel#subtitle {{
        font-size: 14px;
        color: {COLORS['text_muted']};
    }}
    QLabel#section {{
        font-size: 16px;
        font-weight: bold;
        color: {COLORS['text_secondary']};
    }}
    QLabel#error {{
        color: {COLORS['accent_red']};
        font-size: 12px;
    }}
    QLabel#success {{
        color: {COLORS['accent_green']};
        font-size: 12px;
    }}
    QLineEdit {{
        background-color: {COLORS['bg_tertiary']};
        color: {COLORS['text_primary']};
        border: 2px solid {COLORS['border']};
        border-radius: 8px;
        padding: 10px;
        font-size: 13px;
        selection-background-color: {COLORS['accent_blue']};
    }}
    QLineEdit:focus {{
        border: 2px solid {COLORS['accent_blue']};
    }}
    QComboBox {{
        background-color: {COLORS['bg_tertiary']};
        color: {COLORS['text_primary']};
        border: 2px solid {COLORS['border']};
        border-radius: 8px;
        padding: 10px;
        font-size: 13px;
    }}
    QComboBox:focus {{
        border: 2px solid {COLORS['accent_blue']};
    }}
    QComboBox::drop-down {{
        border: none;
        width: 25px;
    }}
    QComboBox QAbstractItemView {{
        background-color: {COLORS['bg_tertiary']};
        color: {COLORS['text_primary']};
        selection-background-color: {COLORS['accent_blue']};
        border: 1px solid {COLORS['border']};
    }}
    QPushButton {{
        background-color: {COLORS['accent_blue']};
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 20px;
        font-size: 13px;
        font-weight: bold;
    }}
    QPushButton:hover {{
        background-color: #2563eb;
    }}
    QPushButton:pressed {{
        background-color: #1d4ed8;
    }}
    QPushButton:disabled {{
        background-color: {COLORS['border']};
        color: {COLORS['text_muted']};
    }}
    QPushButton#success {{
        background-color: {COLORS['accent_green']};
    }}
    QPushButton#success:hover {{
        background-color: #059669;
    }}
    QPushButton#danger {{
        background-color: {COLORS['accent_red']};
    }}
    QPushButton#danger:hover {{
        background-color: #dc2626;
    }}
    QPushButton#warning {{
        background-color: {COLORS['accent_yellow']};
    }}
    QPushButton#warning:hover {{
        background-color: #d97706;
    }}
    QPushButton#ghost {{
        background-color: transparent;
        border: 2px solid {COLORS['border']};
        color: {COLORS['text_secondary']};
    }}
    QPushButton#ghost:hover {{
        background-color: {COLORS['bg_tertiary']};
        border: 2px solid {COLORS['accent_blue']};
        color: {COLORS['text_primary']};
    }}
    QSpinBox {{
        background-color: {COLORS['bg_tertiary']};
        color: {COLORS['text_primary']};
        border: 2px solid {COLORS['border']};
        border-radius: 8px;
        padding: 8px;
        font-size: 14px;
    }}
    QSpinBox:focus {{
        border: 2px solid {COLORS['accent_blue']};
    }}
    QFrame#card {{
        background-color: {COLORS['bg_card']};
        border: 1px solid {COLORS['border']};
        border-radius: 12px;
    }}
    QFrame#cardHighlight {{
        background-color: {COLORS['bg_card']};
        border: 2px solid {COLORS['accent_blue']};
        border-radius: 12px;
    }}
    QScrollArea {{
        background: transparent;
        border: none;
    }}
    QScrollBar:vertical {{
        background: {COLORS['bg_secondary']};
        width: 8px;
        border-radius: 4px;
    }}
    QScrollBar::handle:vertical {{
        background: {COLORS['border']};
        border-radius: 4px;
        min-height: 20px;
    }}
    QScrollBar::handle:vertical:hover {{
        background: {COLORS['border_light']};
    }}
    QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {{
        height: 0px;
    }}
    QMessageBox {{
        background-color: {COLORS['bg_secondary']};
    }}
    QMessageBox QLabel {{
        color: {COLORS['text_primary']};
        font-size: 13px;
    }}
    QMessageBox QPushButton {{
        background-color: {COLORS['accent_blue']};
        color: white;
        border: none;
        border-radius: 6px;
        padding: 8px 16px;
        min-width: 80px;
    }}
    QMessageBox QPushButton:hover {{
        background-color: #2563eb;
    }}
    QDialog {{
        background-color: {COLORS['bg_secondary']};
    }}
    QTableWidget {{
        background-color: {COLORS['bg_card']};
        color: {COLORS['text_primary']};
        border: 1px solid {COLORS['border']};
        border-radius: 8px;
        gridline-color: {COLORS['border']};
    }}
    QTableWidget::item {{
        padding: 8px;
    }}
    QTableWidget::item:selected {{
        background-color: {COLORS['accent_blue']};
    }}
    QHeaderView::section {{
        background-color: {COLORS['bg_tertiary']};
        color: {COLORS['text_secondary']};
        padding: 8px;
        border: none;
        font-weight: bold;
    }}
"""