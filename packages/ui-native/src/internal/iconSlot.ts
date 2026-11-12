import { cloneElement, isValidElement, type ReactNode } from 'react';

/** The kit sizes an icon by its slot (CONVENTIONS "Type": buttons 16, sm 14, lg 19; fields 16; Alert 16;
 *  rows and the header 18; Toast 13), as web's CSS does: an element passed into a slot (the kit `Icon`, a
 *  lucide icon, an svg component taking `size`) gets the slot's `size` unless it sets its own. Anything
 *  else renders as given. A slot with a colour (a field's icon: `textFaint`) also gives it that colour. */
export function sizedIcon(node: ReactNode, size: number, color?: string): ReactNode {
  if (!isValidElement<{ size?: number; color?: string }>(node)) return node;
  const props: { size?: number; color?: string } = {};
  if (node.props.size == null) props.size = size;
  if (color != null && node.props.color == null) props.color = color;
  return Object.keys(props).length ? cloneElement(node, props) : node;
}
