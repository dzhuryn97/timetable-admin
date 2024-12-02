import React from "react";
import { Link } from "react-router-dom";

export default function LinkButton({
  to,
  children,
  colorScheme,
  style,
}: {
  to: string;
  style?: object;
  children: React.ReactNode;
  colorScheme?: string;
}) {
  let innerStyle: object;

  switch (colorScheme) {
    case "yellow":
      innerStyle = {
        background: "var(--chakra-colors-yellow-400)",
        color: "var(--chakra-colors-black)",
      };
      break;
    case "green":
      innerStyle = {
        background: "var(--chakra-colors-green-500)",
        color: "var(--chakra-colors-white)",
      };
      break;
    default:
      innerStyle = {
        background: "var(--chakra-colors-gray-100)",
        color: "var(--chakra-colors-gray-800)",
      };
  }

  return (
    <Link
      style={Object.assign(
        {
          padding: "var(--chakra-space-3)",
          borderRadius: "var(--chakra-radii-md)",
        },
        innerStyle,
        style,
      )}
      to={to}
    >
      {children}
    </Link>
  );
}
