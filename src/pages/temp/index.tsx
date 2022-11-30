import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import map from 'lodash/map';
// import css modules
import styles from './style.module.scss';

interface SensorData {
    room: string;
    temperature: number;
    humidity: number;
}
interface PropTypes {
    sensorData: SensorData;
}
const SensorComponent = (props: PropTypes) => {
    console.log(props.sensorData);
    return (
        <div>
            <h1 className="">Sensor</h1>
            <table className={styles.sensortable}>
                <thead>
                    <tr>
                        <th>Raum</th>
                        <th>Temperatur</th>
                        <th>Luftfeuchtigkeit</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{props.sensorData.room}</td>
                        <td>{props.sensorData.temperature}</td>
                        <td>{Math.round(props.sensorData.humidity)}</td>
                    </tr>
                </tbody>
            </table>

        </div>
    );
};


const Temp = () => {

    const session = useSession();
    const tempData = trpc.temp.getTemps.useQuery();
    const tempDataSecret = session.status === 'authenticated' ? trpc.temp.getSecretTemps.useQuery() : trpc.temp.getTemps.useQuery();

    const data: SensorData[] = []
    if (tempData.data) {
        data.push(tempData.data);
    }
    return (
        <div>
            <h1 className="">Temp</h1>
            <div className='flex '>
                {tempData.isLoading || tempDataSecret.isLoading ? <div>Loading...</div> : map(data, (sensorData) => {
                    return (
                        <SensorComponent sensorData={sensorData} />
                    )
                })}
            </div>
        </div>
    );
};

export default Temp;