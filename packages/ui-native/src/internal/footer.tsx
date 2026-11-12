import { Children, Fragment, isValidElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

/** The actions of a dialog footer (CONVENTIONS "Dialog actions"): each one a cell of equal width in a row,
 *  in the order given ("Cancel | Primary"). A fragment's children count one by one. */
export function FooterActions({ children, equal }: { children: ReactNode; equal: boolean }) {
  const items = isValidElement<{ children?: ReactNode }>(children) && children.type === Fragment ? children.props.children : children;
  return (
    <>
      {Children.toArray(items).map((child, i) => (
        <View key={i} style={equal ? styles.cell : undefined}>
          {child}
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  // equal width, and a long label wraps inside its own half
  cell: { flex: 1, flexBasis: 0, minWidth: 0 },
});
