import XSvg from '../svgs/X';
import { MdHomeFilled } from 'react-icons/md';
import { IoNotifications } from 'react-icons/io5';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const queryClient = useQueryClient();
  
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST',
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Что-то пошло не так');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: () => {
      toast.error('Ошибка выхода');
    },
  });

  const { data: authUser } = useQuery({ queryKey: ['authUser'] });

  const { data: notificationData } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Что-то пошло не так');
      return data;
    },
  });

  return (
    <>
      {/* Десктопная версия */}
      <div className='hidden md:block md:flex-[2_2_0] w-18 max-w-52'>
        <div className='sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full'>
          <Link to='/' className='flex justify-center md:justify-start'>
            <XSvg className='px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900' />
          </Link>
          
          <ul className='flex flex-col gap-3 mt-4'>
            <li className='flex justify-center md:justify-start'>
              <Link
                to='/'
                className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
              >
                <MdHomeFilled className='w-8 h-8' />
                <span className='text-lg hidden md:block'>Домой</span>
              </Link>
            </li>

            <li className='flex justify-center md:justify-start'>
              <Link
                to='/notifications'
                className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
              >
                <IoNotifications className='w-6 h-6 relative' />
                <span className='text-lg hidden md:block'>Уведомления</span>
                {notificationData?.unread && (
                  <span className='w-3 h-3 translate-y-[-3px] bg-red-500 rounded-full'></span>
                )}
              </Link>
            </li>

            <li className='flex justify-center md:justify-start'>
              <Link
                to={`/profile/${authUser?.username}`}
                className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
              >
                <FaUser className='w-6 h-6' />
                <span className='text-lg hidden md:block'>Профиль</span>
              </Link>
            </li>
          </ul>

          {authUser && (
            <Link
              to={`/profile/${authUser.username}`}
              className='mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
            >
              <div className='avatar hidden md:inline-flex'>
                <div className='w-8 rounded-full'>
                  <img 
                    src={authUser?.profileImg || '/avatar-placeholder.png'} 
                    alt='Аватар'
                  />
                </div>
              </div>
              <div className='flex justify-between flex-1'>
                <div className='hidden md:block'>
                  <p className='text-white font-bold text-sm w-20 truncate'>
                    {authUser?.fullName}
                  </p>
                  <p className='text-slate-500 text-sm'>@{authUser?.username}</p>
                </div>
                <BiLogOut
                  className='w-5 h-5 cursor-pointer'
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Мобильная версия */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-700 z-50'>
        <ul className='flex flex-row h-full justify-around items-center'>
          <li>
            <Link
              to='/'
              className='flex items-center justify-center p-3 hover:bg-stone-900 rounded-full'
            >
              <MdHomeFilled className='w-8 h-8' />
            </Link>
          </li>

          <li>
            <Link
              to='/notifications'
              className='flex items-center justify-center p-3 hover:bg-stone-900 rounded-full relative'
            >
              <IoNotifications className='w-8 h-8' />
              {notificationData?.unread && (
                <span className='absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full' />
              )}
            </Link>
          </li>

          <li>
            <Link
              to={`/profile/${authUser?.username}`}
              className='flex items-center justify-center p-3 hover:bg-stone-900 rounded-full'
            >
              <FaUser className='w-8 h-8' />
            </Link>
          </li>

          {authUser && (
            <li>
              <button 
                onClick={logout}
                className='p-3 hover:bg-stone-900 rounded-full'
              >
                <BiLogOut className='w-8 h-8' />
              </button>
            </li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;