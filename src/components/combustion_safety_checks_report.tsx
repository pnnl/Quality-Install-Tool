import { FC, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PhotoWrapper from './photo_wrapper'
import { useDB } from '../utilities/database_utils'

const CombustionSafetyChecksReport: FC<{ path: string }> = ({ path }) => {
    const [appliances, setAppliances] = useState<any>({})
    const [appliancesKey, setAppliancesKey] = useState<any[]>(
        Object.keys(appliances),
    )
    const { projectId } = useParams()
    const db = useDB()

    const fetchAppliances = async () => {
        if (!projectId) {
            console.error('projectId is undefined')
            return
        }
        try {
            const res: any = await db.get(projectId)
            const appliances_data = res.data_[path]
            if (appliances_data && Object.keys(appliances_data).length > 0) {
                setAppliances(appliances_data)
                setAppliancesKey(Object.keys(appliances_data))
            }
        } catch (err) {
            console.error('Failed to fetch appliances:', err)
        }
    }

    // Fetch appliances from the database when component mounts
    useEffect(() => {
        fetchAppliances()
        const changes = db
            .changes({
                live: true,
                since: 'now',
                include_docs: true,
            })
            .on('change', () => {
                // Call fetchAppliances() when a change is detected in DB
                fetchAppliances()
            })
            .on('error', (err: any) => {
                console.error('Changes feed error:', err)
            })

        // Clean up the change listener when the component unmounts
        return () => {
            changes.cancel()
        }
    }, [])
    return (
        <div>
            {appliances && Object.values(appliances)[0] && (
                <h2>Combustion Appliance Safety Testing</h2>
            )}
            {appliancesKey &&
                appliancesKey.map((appliance_key: string, index: number) => (
                    <div key={appliance_key}>
                        <div>
                            <div className="top-bottom-padding">
                                Appliance Type:{' '}
                                <strong>{`${
                                    appliances[appliance_key]?.name
                                        ? appliances[appliance_key]?.name
                                        : ''
                                }`}</strong>
                            </div>
                            <PhotoWrapper
                                id={`${path}.${appliance_key}.indoor_ambient_air_co_level_photo`}
                                label="Indoor ambient air CO level - Photo"
                                docId={`${projectId}`}
                                fromParent
                                required={false}
                            >
                                Indoor ambient air CO level readout photo
                            </PhotoWrapper>
                            <div className="top-bottom-padding">
                                Does the ambient CO test pass?
                                <strong>
                                    {' '}
                                    {`${
                                        appliances[appliance_key]
                                            ?.ambient_CO_test
                                            ? appliances[appliance_key]
                                                  ?.ambient_CO_test
                                            : ''
                                    }`}{' '}
                                </strong>{' '}
                            </div>

                            {appliances[appliance_key]?.name ===
                                'Gas/Oil Water Heater' && (
                                <div>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.water_heater_photo`}
                                        label="Water heater - Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the Water Heater
                                    </PhotoWrapper>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.water_heater_pipe_connection_leak_check_photo`}
                                        label="Pipe Connection Leak Check - Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the the accessible section of
                                        Gas Piping
                                    </PhotoWrapper>
                                    <div className="top-bottom-padding">
                                        Does the gas leak detection test pass?{' '}
                                        <strong>
                                            {' '}
                                            {`${
                                                appliances[appliance_key]
                                                    ?.water_heater_gas_leak_detection_test
                                                    ? appliances[appliance_key]
                                                          ?.water_heater_gas_leak_detection_test
                                                    : ''
                                            }`}
                                        </strong>
                                    </div>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.water_heater_vent_photo`}
                                        label="Water Heater Vent - Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the Water Heater Vent
                                    </PhotoWrapper>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.water_heater_draft_photo`}
                                        label="Water Heater Draft – Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the Water Heater Draft
                                    </PhotoWrapper>

                                    <div className="top-bottom-padding">
                                        Does the spillage test(s) pass?{' '}
                                        <strong>
                                            {`${
                                                appliances[appliance_key]
                                                    ?.water_heater_spillage_test
                                                    ? appliances[appliance_key]
                                                          ?.water_heater_spillage_test
                                                    : ''
                                            }`}
                                        </strong>
                                    </div>

                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.water_heater_co_measurement_photo`}
                                        label="Water heater CO measurement – Photo "
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the combustion analyzer readout
                                    </PhotoWrapper>

                                    <div className="top-bottom-padding">
                                        Does the undiluted CO test pass?{' '}
                                        <strong>
                                            {`${
                                                appliances[appliance_key]
                                                    ?.water_heater_undiluted_CO_test
                                                    ? appliances[appliance_key]
                                                          ?.water_heater_undiluted_CO_test
                                                    : ''
                                            }`}
                                        </strong>
                                    </div>
                                </div>
                            )}
                            {appliances[appliance_key]?.name ===
                                'Gas/Oil Furnace/Boiler' && (
                                <div>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.space_heating_appliance_photo`}
                                        label="Space Heating Appliance - Photo "
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the combustion heating
                                        appliance
                                    </PhotoWrapper>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.space_heating_pipe_connection_leak_check_photo`}
                                        label="Pipe Connection Leak Check - Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of accessible section of the Gas
                                        Piping
                                    </PhotoWrapper>
                                    <div className="top-bottom-padding">
                                        Does the gas leak detection test pass?{' '}
                                        <strong>{`${
                                            appliances[appliance_key]
                                                ?.space_heating_gas_leak_detection_test
                                                ? appliances[appliance_key]
                                                      ?.space_heating_gas_leak_detection_test
                                                : ''
                                        }`}</strong>
                                    </div>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.space_heating_appliance_vent_photo`}
                                        label="Space heating Appliance Vent - Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the Space heating Appliance
                                        Vent
                                    </PhotoWrapper>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.space_heating_appliance_draft_photo`}
                                        label="Space heating Appliance Draft – Photo"
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the Space heating Appliance
                                        Draft
                                    </PhotoWrapper>
                                    <div className="top-bottom-padding">
                                        Does the spillage test(s) pass?{' '}
                                        <strong>
                                            {`${
                                                appliances[appliance_key]
                                                    ?.space_heating_spillage_test
                                                    ? appliances[appliance_key]
                                                          ?.space_heating_spillage_test
                                                    : ''
                                            }`}
                                        </strong>
                                    </div>
                                    <PhotoWrapper
                                        id={`${path}.${appliance_key}.space_heating_appliance_co_measurement_photo`}
                                        label="Space heating Appliance CO measurement – Photo "
                                        docId={`${projectId}`}
                                        fromParent
                                        required={false}
                                    >
                                        Photo of the combustion analyzer readout
                                    </PhotoWrapper>
                                    <div className="top-bottom-padding">
                                        Does the undiluted CO test pass?{' '}
                                        <strong>
                                            {`${
                                                appliances[appliance_key]
                                                    ?.space_heating_undiluted_CO_test
                                                    ? appliances[appliance_key]
                                                          ?.space_heating_undiluted_CO_test
                                                    : ''
                                            }`}{' '}
                                        </strong>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default CombustionSafetyChecksReport
