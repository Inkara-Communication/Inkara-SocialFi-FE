import { TrashIcon } from '@/components/icons';
import MoreItem from './more-item';
import EditProfile from '@/components/icons/edit';

//--------------------------------------------------------------------------------------------------------

interface MoreOptionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function MoreOptions({ onEdit, onDelete }: MoreOptionsProps) {
  const _moreOptions = [
    {
      title: 'Edit',
      icon: <EditProfile />,
      onClick: onEdit,
    },
    {
      title: 'Delete',
      icon: <TrashIcon />,
      onClick: onDelete,
    },
  ];

  return (
    <div className="absolute z-10 flex-col w-[15rem] p-2 bg-neutral3-70 shadow-dropup backdrop-blur-[32px] rounded-[1.5rem] top-[3rem] right-1">
      {_moreOptions.map((item) => (
        <MoreItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          onClick={item.onClick}
        />
      ))}
    </div>
  );
}
