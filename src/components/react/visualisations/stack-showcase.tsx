import { useState } from "react";

import { AbstractPlane } from "../svg/atoms/abstract-plane";
import type { AbstractPlaneProps } from "../svg/atoms/abstract-plane";
import { VisualizationBody, VisualizationContainer } from "./layout";

interface StackAbstractProps {
  activeGates?: number;
  showTransportBeam?: boolean;
  appIsReachable?: boolean;
  separation?: number;
  stackOffset?: number;
}

const AbstractLegend = () => {
  const layers: Array<{
    label: string;
    props: Omit<AbstractPlaneProps, "zIndex">;
  }> = [
    {
      label: "User",
      props: {
        active: false,
        pattern: "grid",
        outlineStyle: "solid",
        split: true,
        secondaryPattern: "grid",
        showSplitPart: "secondary",
        secondaryColor: "#364CD0",
      },
    },
    {
      label: "Device",
      props: {
        active: false,
        pattern: "waves",
        outlineStyle: "solid",
        split: true,
        showSplitPart: "primary",
        color: "#35A15B",
      },
    },
    {
      label: "Policy",
      props: {
        active: true,
        pattern: "diagonal",
        outlineStyle: "dashed",
      },
    },
    {
      label: "Transport",
      props: {
        active: false,
        pattern: "dots",
        outlineStyle: "solid",
      },
    },
    {
      label: "App",
      props: {
        active: false,
        pattern: "solid",
        outlineStyle: "solid",
      },
    },
  ];

  return (
    <div className="grid grid-cols-5 border-neutral-200 dark:border-neutral-800">
      {layers.map((layer, index) => (
        <div
          key={index}
          className="flex flex-col items-center border-r last:border-r-0 border-neutral-200 dark:border-neutral-800"
        >
          <div className="w-full relative aspect-[300/180] max-w-[120px] bg-white">
            <AbstractPlane
              {...layer.props}
              zIndex={0}
              className="w-full h-full"
            />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-center w-full border-y border-neutral-200 dark:border-neutral-800 p-2 bg-neutral-50 dark:bg-black text-neutral-500 dark:text-neutral-400">
            {layer.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const StackAbstract: React.FC<StackAbstractProps> = ({
  separation = 45,
  stackOffset = 4,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Differentiate layers by pattern and minor active state tweaks
  const layers: AbstractPlaneProps[] = [
    {
      label: "DEVICE",
      active: false,
      pattern: "waves",
      outlineStyle: "solid",
      color: "#35A15B",
      split: true,
      secondaryLabel: "USER",
      secondaryPattern: "grid",
      secondaryColor: "#364CD0",
      zIndex: 0,
    },
    {
      label: "POLICY",
      active: true,
      pattern: "diagonal",
      outlineStyle: "dashed",
      zIndex: 1,
    }, // Policy = Hatching (Active/Action)
    {
      label: "TRANSPORT",
      active: false,
      pattern: "dots",
      outlineStyle: "solid",
      zIndex: 2,
    }, // Transport = Dots (Particles)
    {
      label: "APP",
      active: false,
      pattern: "solid",
      outlineStyle: "solid",
      zIndex: 3,
    }, // App = Solid/Center focus
  ];

  return (
    <div className="relative w-full font-mono">
      <div className="relative w-full flex items-center justify-center">
        <div
          className="relative cursor-pointer w-full max-w-[340px] mt-10"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ height: `${(layers.length + 2) * separation}px` }}
        >
          {layers.map((layer, index) => (
            <div
              key={index}
              className="absolute top-0 w-[240px] left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                transform: isHovered
                  ? `translateY(${index * stackOffset}px)`
                  : `translateY(${index * separation}px)`,
                transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
                transitionDelay: isHovered
                  ? `${index * 0.02}s`
                  : `${(layers.length - index) * 0.02}s`,
                zIndex: layers.length - index,
              }}
            >
              <AbstractPlane
                active={layer.active}
                label={layer.label}
                zIndex={index}
                pattern={layer.pattern}
                outlineStyle={layer.outlineStyle}
                split={layer.split}
                color={layer.color}
                secondaryLabel={layer.secondaryLabel}
                secondaryPattern={layer.secondaryPattern}
                secondaryColor={layer.secondaryColor}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const StackShowcase = () => {
  return (
    <VisualizationContainer className="border-t md:border-none border-neutral-200 dark:border-neutral-800">
      <AbstractLegend />
      <VisualizationBody className="w-full space-y-4 bg-neutral-50 dark:bg-neutral-900">
        <div className="w-full">
          <StackAbstract activeGates={3} stackOffset={15} />
        </div>

        <span className="py-2 text-center w-full block text-[10px] font-mono uppercase tracking-widest text-neutral-500">
          [Hover over layers]
        </span>
      </VisualizationBody>
    </VisualizationContainer>
  );
};

export default StackShowcase;
