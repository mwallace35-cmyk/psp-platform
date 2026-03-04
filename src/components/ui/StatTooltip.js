'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatTooltip;
var react_1 = require("react");
function StatTooltip(_a) {
    var abbr = _a.abbr, definition = _a.definition;
    var _b = (0, react_1.useState)(false), isVisible = _b[0], setIsVisible = _b[1];
    var containerRef = (0, react_1.useRef)(null);
    var tooltipRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var handleKeyDown = function (e) {
            if (e.key === 'Escape' && isVisible) {
                setIsVisible(false);
            }
        };
        if (isVisible) {
            document.addEventListener('keydown', handleKeyDown);
            return function () { return document.removeEventListener('keydown', handleKeyDown); };
        }
    }, [isVisible]);
    return (React.createElement("span", { ref: containerRef, className: "relative inline-block", onMouseEnter: function () { return setIsVisible(true); }, onMouseLeave: function () { return setIsVisible(false); }, onFocus: function () { return setIsVisible(true); }, onBlur: function () { return setIsVisible(false); } },
        React.createElement("span", { className: "border-b border-dotted border-current cursor-help", role: "button", tabIndex: 0, "aria-describedby": "stat-tooltip-".concat(abbr.replace(/\s+/g, '-')) }, abbr),
        isVisible && (React.createElement("div", { ref: tooltipRef, id: "stat-tooltip-".concat(abbr.replace(/\s+/g, '-')), className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50", role: "tooltip" },
            React.createElement("div", { className: "absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#0a1628]" }),
            React.createElement("div", { className: "bg-[#0a1628] text-white text-xs px-3 py-2 rounded-md shadow-lg max-w-[200px] w-max" }, definition)))));
}
