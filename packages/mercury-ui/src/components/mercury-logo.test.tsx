import { act, create } from 'react-test-renderer';
import { describe, expect, it, vi } from 'vitest';
import { MercuryLogo } from './mercury-logo';

vi.mock('../../assets/brand/mercury_logo_horizontal.png', () => ({
  default: 'horizontal-logo.png',
}));

vi.mock('../../assets/brand/mercury_logo_icon.png', () => ({
  default: 'icon-logo.png',
}));

vi.mock('../../assets/brand/mercury_logo_vertical.png', () => ({
  default: 'vertical-logo.png',
}));

describe('MercuryLogo', () => {
  it('renders the selected logo variant', () => {
    let rendered!: ReturnType<typeof create>;

    act(() => {
      rendered = create(<MercuryLogo variant="icon" size={32} />);
    });

    expect(rendered.toJSON()).toBeTruthy();
  });

  it('wraps copied asset strings in a React Native Image source object', () => {
    let rendered!: ReturnType<typeof create>;

    act(() => {
      rendered = create(<MercuryLogo variant="horizontal" size={120} />);
    });

    const image = rendered.root.find((node) => node.props?.source != null);
    expect(image.props.source).toEqual({ uri: 'horizontal-logo.png' });
  });
});

