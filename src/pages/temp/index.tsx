import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import map from 'lodash/map';

const SensorComponent = (sensorData: any) => {
    return (
        <div>
            <h1 className="">Sensor</h1>
            <div>{JSON.stringify(sensorData)}</div>

        </div>
    );
};


const Temp = () => {

    const session = useSession();
    const tempData = trpc.temp.getTemps.useQuery();
    const tempDataSecret = session.status === 'authenticated' ? trpc.temp.getSecretTemps.useQuery() : trpc.temp.getTemps.useQuery();

    const data = {
        ...tempData.data,
        ...tempDataSecret.data
    }
    return (
        <div>
            <h1 className="">Temp</h1>
            <div className='flex '>
                {map(data, (sensorData: any) => {
                    return (
                        <SensorComponent {...sensorData} />
                    )
                })}
            </div>
        </div>
    );
};

export default Temp;