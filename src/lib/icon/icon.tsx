import listIconUrl from '@/lib/icon/svg/list.svg?url';
import gridIconUrl from '@/lib/icon/svg/grid.svg?url';

const icons = {
  'list': listIconUrl,
  'grid': gridIconUrl
}

export type IconName = keyof typeof icons;

export const Icon = ({ name, size = 16 }: { name: IconName, size?: number }) => (
  <img src={icons[name]} width={size} height={size} alt="" />
)