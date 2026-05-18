import Image from "next/image";

export function NFMark({ size = 32 }: { size?: number }) {
  return (
    <Image
      src="/nextfit-mark-t.png"
      alt="NextFit"
      height={size}
      width={Math.round(size * 2.46)}
      style={{ height: size, width: "auto" }}
      draggable={false}
      priority
    />
  );
}
