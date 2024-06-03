import { Skeleton } from 'primereact/skeleton';

const Skeletons = () => {
    return (
        <>
            <Skeleton className='ml-6' animation='wave' borderRadius='10px' width="200px" height="250px"></Skeleton>
            <Skeleton animation='wave' borderRadius='10px' width="200px" height="250px"></Skeleton>
            <Skeleton animation='wave' borderRadius='10px' width="200px" height="250px"></Skeleton>
            <Skeleton animation='wave' borderRadius='10px' width="200px" height="250px"></Skeleton>
            <Skeleton animation='wave' borderRadius='10px' width="200px" height="250px"></Skeleton>
        </>
    )
}

export default Skeletons;