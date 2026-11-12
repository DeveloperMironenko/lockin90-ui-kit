import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { absoluteFill } from '../internal/absoluteFill';

/* An open kit Sheet or Modal is an RN `Modal`: a native window (iOS a presented view controller,
   Android a Dialog) above the whole page, so nothing drawn in the page can be above it, whatever its
   zIndex. A TopLayer's children are therefore drawn inside the top-most open Sheet / Modal (its
   `TopLayerHost`, the last child of its window, over the scrim and the panel), and in place when none
   is open. One module-level store, no provider: the hosts open, in the order they opened, and what
   each TopLayer draws. */
let hosts: number[] = [];
const layers = new Map<number, ReactNode>();
let version = 0;
let nextId = 1;
const listeners = new Set<() => void>();

function changed() {
  version += 1;
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const topHost = () => hosts[hosts.length - 1];
const readVersion = () => version;

export interface TopLayerProps {
  /** What to draw above everything, e.g. an app's toast (absolutely placed: the box it is placed in is
   *  the screen inside a Sheet / Modal, and the TopLayer's parent otherwise; make that parent
   *  screen-sized). Give it `pointerEvents="none"` unless it should take touches. */
  children?: ReactNode;
}

/** Draws its children above everything: inside the top-most open kit `Sheet` or `Modal` (native
 *  windows the page can't draw over), in place when none is open. For toasts and other notices that
 *  must stay visible over an open sheet; iOS and Android alike. */
export function TopLayer({ children }: TopLayerProps) {
  const id = useRef(0);
  if (!id.current) id.current = nextId++;
  const host = useSyncExternalStore(subscribe, topHost, topHost);

  // in a host: hand the children over (again on every render, so they stay current)
  useEffect(() => {
    if (host === undefined) return;
    layers.set(id.current, children);
    changed();
  });
  useEffect(() => {
    if (host === undefined) return;
    const mine = id.current;
    return () => {
      layers.delete(mine);
      changed();
    };
  }, [host]);

  return host === undefined ? <>{children}</> : null;
}

/** The place a Sheet / Modal keeps for TopLayers: the last child of its native window, full screen,
 *  touches passing through to the scrim and the panel. Takes part only while `active` (the Sheet /
 *  Modal open); the latest one opened is the top. */
export function TopLayerHost({ active }: { active: boolean }) {
  const id = useRef(0);
  if (!id.current) id.current = nextId++;
  useSyncExternalStore(subscribe, readVersion, readVersion);

  useEffect(() => {
    if (!active) return;
    const mine = id.current;
    hosts = [...hosts, mine];
    changed();
    return () => {
      hosts = hosts.filter((h) => h !== mine);
      changed();
    };
  }, [active]);

  if (!active || topHost() !== id.current || layers.size === 0) return null;
  return (
    <View style={styles.host} pointerEvents="box-none">
      {[...layers.entries()].map(([key, node]) => (
        <View key={key} style={styles.host} pointerEvents="box-none">
          {node}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { ...absoluteFill },
});
