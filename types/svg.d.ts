
// SVG module definition for SVGR
declare module "*.svg" {
    import React from "react";
    const SVG: React.FC<React.SVGProps<SVGSVGElement>>;
    export default SVG;
}
