import React from 'react'

export default function Popup({ title, children, openPopup, setOpenPopup }) {
    if (!openPopup) return null;

    return (
        <div style={overlayStyle} onMouseDown={() => setOpenPopup(false)}>
            <div style={dialogStyle} onMouseDown={(e) => e.stopPropagation()}>
                <div style={titleRowStyle}>
                    <div style={{ fontSize: 18, fontWeight: 600 }}>{title}</div>
                    <button
                        onClick={() => setOpenPopup(false)}
                        aria-label="close"
                        style={closeButtonStyle}
                    >
                        ✕
                    </button>
                </div>

                <div style={{ marginTop: 12 }}>{children}</div>
            </div>
        </div>
    );
}

const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 48,
    zIndex: 9999,
};

const dialogStyle = {
    background: '#fff',
    borderRadius: 8,
    padding: 16,
    width: 'min(900px, 95%)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
};

const titleRowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const closeButtonStyle = {
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
};
