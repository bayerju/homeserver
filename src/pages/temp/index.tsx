import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import map from 'lodash/map';
// import css modules
import styles from './style.module.scss';
import React from 'react';

interface SensorData {
    room: string;
    temperature: number;
    humidity: number;
}
interface PropTypes {
    sensorData: SensorData;
}

const SensorDataComponent = (props: PropTypes) => {
    return (
        < tr >
            <td>{props.sensorData.room}</td>
            <td>{Math.round(props.sensorData.temperature * 10) / 10}</td>
            <td>{Math.round(props.sensorData.humidity * 10) / 10}</td>
        </ tr>
    )
}

interface Props {
    children: React.ReactNode;
}
const SensorsTable = ({ children }: Props) => {
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

                    {children}
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
        map(tempData.data, (value, key) => {
            data.push(value);
        });
    }
    return (
        <div>
            <h1 className="">Temp</h1>
            <div className='flex '>
                {tempData.isLoading || tempDataSecret.isLoading ? <div>Loading...</div> : map(data, (sensorData) => {
                    console.log(data)
                    return (
                        <SensorsTable >
                            {map(data, (sensorData) => {
                                return (
                                    <SensorDataComponent sensorData={sensorData} />
                                )
                            })}
                        </SensorsTable>
                    )
                })}
            </div>
        </div>
    );
};

export default Temp;