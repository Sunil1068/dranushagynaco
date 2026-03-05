export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="#874B61" strokeLinecap="round" strokeLinejoin="round">
          {/* ── Center petal (tall, elegant) ── */}
          <path
            d="M100 30 C108 50 112 72 108 90 C106 96 100 100 100 100
               C100 100 94 96 92 90 C88 72 92 50 100 30Z"
            strokeWidth="3.5"
            fill="#874B61"
            fillOpacity="0.06"
          />

          {/* ── Inner left petal ── */}
          <path
            d="M74 42 C84 52 90 70 88 86 C86 94 82 98 80 100
               C76 96 68 84 66 72 C64 58 66 48 74 42Z"
            strokeWidth="3.5"
            fill="#874B61"
            fillOpacity="0.05"
          />

          {/* ── Inner right petal ── */}
          <path
            d="M126 42 C116 52 110 70 112 86 C114 94 118 98 120 100
               C124 96 132 84 134 72 C136 58 134 48 126 42Z"
            strokeWidth="3.5"
            fill="#874B61"
            fillOpacity="0.05"
          />

          {/* ── Outer left petal (sweeping curve) ── */}
          <path
            d="M44 62 C56 58 72 64 82 78 C88 88 86 96 84 102
               C78 98 64 92 54 82 C44 72 42 66 44 62Z"
            strokeWidth="3"
            fill="#874B61"
            fillOpacity="0.04"
          />

          {/* ── Outer right petal (sweeping curve) ── */}
          <path
            d="M156 62 C144 58 128 64 118 78 C112 88 114 96 116 102
               C122 98 136 92 146 82 C156 72 158 66 156 62Z"
            strokeWidth="3"
            fill="#874B61"
            fillOpacity="0.04"
          />

          {/* ── Far left leaf petal ── */}
          <path
            d="M28 86 C42 78 62 78 76 90 C82 96 84 102 84 106
               C76 104 56 100 42 94 C32 90 28 88 28 86Z"
            strokeWidth="3"
            fill="#874B61"
            fillOpacity="0.04"
          />

          {/* ── Far right leaf petal ── */}
          <path
            d="M172 86 C158 78 138 78 124 90 C118 96 116 102 116 106
               C124 104 144 100 158 94 C168 90 172 88 172 86Z"
            strokeWidth="3"
            fill="#874B61"
            fillOpacity="0.04"
          />

          {/* ── Calyx curves ── */}
          <path d="M78 100 C84 112 100 118 100 118 C100 118 116 112 122 100" strokeWidth="3" />
          <path d="M84 104 C90 114 100 116 100 116 C100 116 110 114 116 104" strokeWidth="2.5" />

          {/* ── Stem ── */}
          <path d="M100 116 C100 130 100 150 100 170" strokeWidth="4" />

          {/* ── Small stem leaves ── */}
          <path d="M100 140 C92 134 84 136 80 142" strokeWidth="2.8" />
          <path d="M100 152 C108 146 116 148 120 154" strokeWidth="2.8" />

          {/* ── Stamens ── */}
          <path d="M100 92 L100 62" strokeWidth="2.8" />
          <path d="M94 94 L86 68" strokeWidth="2.8" />
          <path d="M106 94 L114 68" strokeWidth="2.8" />
          <path d="M90 96 L78 76" strokeWidth="2.5" />
          <path d="M110 96 L122 76" strokeWidth="2.5" />

          {/* ── Stamen tip dots ── */}
          <circle cx="100" cy="60" r="4" fill="#874B61" stroke="none" />
          <circle cx="85" cy="66" r="3.8" fill="#874B61" stroke="none" />
          <circle cx="115" cy="66" r="3.8" fill="#874B61" stroke="none" />
          <circle cx="76" cy="74" r="3.5" fill="#874B61" stroke="none" />
          <circle cx="124" cy="74" r="3.5" fill="#874B61" stroke="none" />

          {/* ── Petal center vein lines (subtle detail) ── */}
          <path d="M100 50 L100 88" strokeWidth="1.2" opacity="0.3" />
          <path d="M78 56 L84 88" strokeWidth="1.2" opacity="0.3" />
          <path d="M122 56 L116 88" strokeWidth="1.2" opacity="0.3" />
        </g>
      </svg>
    </div>
  );
}
