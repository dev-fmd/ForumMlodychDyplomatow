import React from "react";

type ComponentMap = Record<string, React.ComponentType<any>>;

/**
 * Dynamically renders a list of React components based on a data array.
 *
 * For each object in `data`, this function:
 * 1. Looks up a React component in the `components` map using the object's `_type`.
 * 2. Passes the entire object as the `item` prop to the corresponding component.
 * 3. Warns in the console and renders nothing if no matching component is found.
 */
export function render<C extends ComponentMap>(
  data: { _type: string; _key: string; [prop: string]: any }[],
  components: C
) {
  return data.map((item) => {
    const Component = components[item._type];
    if (!Component) {
      console.warn("No component found for type:", item._type);
      return null; // avoid rendering undefined
    }
    return <Component key={item._key} item={item} />;
  });
}
