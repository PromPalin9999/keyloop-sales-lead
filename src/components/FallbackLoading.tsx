import { memo } from 'react';
import styles from './FallbackLoading.module.css';

export const FallbackLoading = memo(() => {
  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-y-2'>
      <div className={styles.loader}></div>
      <div className='text-xl font-semibold'>Keyloop Loading</div>
    </div>
  );
});
