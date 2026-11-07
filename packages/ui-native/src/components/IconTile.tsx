import { StyleSheet, View, type ViewProps } from 'react-native';
import { colors, radii } from '@lockin90/tokens';
import { Icon, type IconName } from './Icon';

export interface IconTileProps extends Omit<ViewProps, 'children'> {
  /** the kit icon inside */
  icon: IconName;
  /** the glyph's colour, a token (`colors.accent`); the text colour by default */
  color?: string;
}

/** A kit icon on a small bordered tile (design onboarding `.recap .rico`): the leading mark of a
 *  summary row. 38, hidden from screen readers (the row's title names it). Web twin: `IconTile`. */
export function IconTile({ icon, color = colors.text, style, ...rest }: IconTileProps) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.tile, style]}
      {...rest}
    >
      <Icon name={icon} size={18} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border2,
    backgroundColor: colors.bg1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
