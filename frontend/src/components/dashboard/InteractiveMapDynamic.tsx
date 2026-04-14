"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("./InteractiveMap"),
  { ssr: false }
);

export default function InteractiveMapDynamic() {
  return <InteractiveMap />;
}
