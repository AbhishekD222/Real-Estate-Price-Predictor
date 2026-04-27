"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(
  () => import("./InteractiveMap"),
  { ssr: false }
);

interface Props {
  location?: string;
}

export default function InteractiveMapDynamic({ location }: Props) {
  return <InteractiveMap location={location} />;
}
