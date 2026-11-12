import { cloneElement, isValidElement, type ReactNode } from 'react';
import { Icon } from '../components/Icon';

/** The kit sizes an icon by its slot (CONVENTIONS "Type": buttons 16, sm 14, lg 19; fields 16 faint; Alert
 *  16; rows and the header 18; Toast 13), as web's CSS does: a kit `Icon` passed into a slot gets the slot's
 *  `size` (and, for a field, its `color`) unless it sets its own. Anything else (an avatar, a brand mark, an
 *  app's own svg) renders as given. */
export function sizedIcon(node: ReactNode, size: number, color?: string): ReactNode {
  if (!isValidElement<{ size?: number; color?: string }>(node) || node.type !== Icon) return node;
  const props: { size?: number; color?: string } = {};
  if (node.props.size == null) props.size = size;
  if (color != null && node.props.color == null) props.color = color;
  return Object.keys(props).length ? cloneElement(node, props) : node;
}
