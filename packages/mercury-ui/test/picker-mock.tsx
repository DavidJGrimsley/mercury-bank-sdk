import React from 'react';

function createHostComponent(name: string) {
  const HostComponent = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => React.createElement(name, props, children);
  HostComponent.displayName = name;
  return HostComponent;
}

const PickerRoot = createHostComponent('Picker');
const PickerItem = createHostComponent('PickerItem');

export const Picker = Object.assign(PickerRoot, {
  Item: PickerItem,
});
