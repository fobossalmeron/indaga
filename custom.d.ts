declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module "*.svg?url" {
  const src: string;
  export default src;
}

declare module "*.svg?unoptimized" {
  import * as React from 'react';
  const content: FC<SVGProps<SVGElement>>
  export default ReactComponent;
}