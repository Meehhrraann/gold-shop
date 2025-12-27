// // In a file like 'components/LoadingModal.js'
// import React from "react";

// const LoadingModal = ({ isLoading }) => {
//   if (!isLoading) return null;

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 9999, // Make sure it's on top
//       }}
//     >
//       <div
//         style={{
//           padding: "20px",
//           background: "white",
//           borderRadius: "8px",
//           fontWeight: "bold",
//         }}
//       >
//         لطفا منتظر بمانید...
//       </div>
//     </div>
//   );
// };

// export default LoadingModal;

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const LoadingModal = ({ isLoading }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLoading]);

  if (!isLoading || !mounted) return null;

  // We render the modal into document.body to escape the parent container
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl bg-white p-6 shadow-2xl">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#e8ca89] border-t-transparent"></div>
        <p className="text-base font-medium text-slate-700" dir="rtl">
          لطفا منتظر بمانید...
        </p>
      </div>
    </div>,
    document.body,
  );
};

export default LoadingModal;
