import { useSession } from 'next-auth/react';
import { trpc } from '../../utils/trpc';
import map from 'lodash/map';

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

interface ButtonProps {
    refresh: () => void;
    isFetching?: boolean;
}
const Button = ({ refresh, isFetching }: ButtonProps) => {
    return (
        <button
            onClick={() => { refresh() }}
            className={styles['refresh-button'] + ' ' + (isFetching ? styles['refresh-button--loading'] : '')}
        >
            Refresh
        </button>
    );
}

interface Props {
    children: React.ReactNode;
}
const SensorsTable = ({ children }: Props) => {
    return (
        <div>
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

    const tempData = trpc.temp.getTemps.useQuery();
    // const tempDataSecret = session.status === 'authenticated' ? trpc.temp.getSecretTemps.useQuery() : trpc.temp.getTemps.useQuery();

    const data: SensorData[] = []
    if (tempData.data) {
        map(tempData.data, (value, key) => {
            data.push(value);
        });
    }
    return (
        <div>
            <div className='flex '>
                {tempData.isLoading ? <div>Loading...</div> :
                    (
                        <SensorsTable >
                            {map(data, (sensorData) => {
                                return (
                                    <SensorDataComponent sensorData={sensorData} key={sensorData.room} />
                                )
                            })}
                        </SensorsTable>
                    )}

            </div>
            <Button refresh={() => {
                tempData.refetch();
            }}
                isFetching={tempData.isFetching}
            />
        </div>
    );
};

export default Temp;