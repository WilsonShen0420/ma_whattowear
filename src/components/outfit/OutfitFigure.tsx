"use client";

import React from "react";
import { OutfitRecommendation } from "@/lib/outfit/types";
import BaseFigure from "./BaseFigure";
import TankTop from "./tops/TankTop";
import TShirt from "./tops/TShirt";
import LongSleeve from "./tops/LongSleeve";
import Sweater from "./tops/Sweater";
import Shorts from "./bottoms/Shorts";
import LightPants from "./bottoms/LightPants";
import ThickPants from "./bottoms/ThickPants";
import LightJacket from "./outerwear/LightJacket";
import Cardigan from "./outerwear/Cardigan";
import Jacket from "./outerwear/Jacket";
import Coat from "./outerwear/Coat";
import DownJacket from "./outerwear/DownJacket";
import Umbrella from "./accessories/Umbrella";
import Scarf from "./accessories/Scarf";
import Sunglasses from "./accessories/Sunglasses";
import Hat from "./accessories/Hat";
import Beanie from "./accessories/Beanie";
import Gloves from "./accessories/Gloves";

interface Props {
  outfit: OutfitRecommendation;
}

function renderTop(id: string, color: string) {
  switch (id) {
    case "tank-top":
      return <TankTop color={color} />;
    case "t-shirt":
      return <TShirt color={color} />;
    case "long-sleeve":
      return <LongSleeve color={color} />;
    case "sweater":
      return <Sweater color={color} />;
    default:
      return <TShirt color={color} />;
  }
}

function renderBottom(id: string, color: string) {
  switch (id) {
    case "shorts":
      return <Shorts color={color} />;
    case "light-pants":
      return <LightPants color={color} />;
    case "thick-pants":
      return <ThickPants color={color} />;
    default:
      return <LightPants color={color} />;
  }
}

function renderOuterwear(id: string, color: string) {
  switch (id) {
    case "light-jacket":
      return <LightJacket color={color} />;
    case "cardigan":
      return <Cardigan color={color} />;
    case "jacket":
      return <Jacket color={color} />;
    case "coat":
      return <Coat color={color} />;
    case "down-jacket":
      return <DownJacket color={color} />;
    default:
      return null;
  }
}

function renderAccessory(id: string, color: string) {
  switch (id) {
    case "umbrella":
      return <Umbrella color={color} />;
    case "scarf":
      return <Scarf color={color} />;
    case "sunglasses":
      return <Sunglasses color={color} />;
    case "hat":
      return <Hat color={color} />;
    case "beanie":
      return <Beanie color={color} />;
    case "gloves":
      return <Gloves color={color} />;
    default:
      return null;
  }
}

export default function OutfitFigure({ outfit }: Props) {
  return (
    <svg
      viewBox="0 0 300 360"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[280px] h-auto mx-auto"
      role="img"
      aria-label="穿搭建議圖"
    >
      {/* z-0: 人物底層 */}
      <BaseFigure />

      {/* z-1: 下身 */}
      {renderBottom(outfit.bottom.id, outfit.bottom.color)}

      {/* z-2: 上衣 */}
      {renderTop(outfit.top.id, outfit.top.color)}

      {/* z-3: 外套 */}
      {outfit.outerwear &&
        renderOuterwear(outfit.outerwear.id, outfit.outerwear.color)}

      {/* z-4: 配件 */}
      {outfit.accessories.map((acc) => (
        <React.Fragment key={acc.id}>
          {renderAccessory(acc.id, acc.color)}
        </React.Fragment>
      ))}

      {/* 雨具 */}
      {outfit.rainGear && renderAccessory(outfit.rainGear.id, outfit.rainGear.color)}
    </svg>
  );
}
