import { cloneElement, isValidElement, type ReactNode } from 'react';

/** The kit sizes an icon by its slot (CONVENTIONS "Type": buttons 16, sm 14, lg 19; fields 16; Alert 16;
 *  rows and the header 18; Toast 13), as web's CSS does: an element passed into a slot (the kit `Icon`, a
 *  lucide icon, an svg component taking `size`) gets the slot's `size` unless it sets its own. Anything
 *  else renders as given. */
export function sizedIcon(node: ReactNode, size: number): ReactNode {
  if (!isValidElement<{ size?: number }>(node)) return node;
  if (node.props.size != null) return node;
  return cloneElement(node, { size });
}
