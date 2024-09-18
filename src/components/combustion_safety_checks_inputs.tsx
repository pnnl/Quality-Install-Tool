import { FC, Key, useEffect, useState } from 'react'
import RadioWrapper from './radio_wrapper'
import { Button } from 'react-bootstrap'
import PhotoInputWrapper from './photo_input_wrapper'
import dbName from './db_details'
import { useParams } from 'react-router-dom'
import PouchDB from 'pouchdb'
import ShowOrHide from './show_or_hide'
import Collapsible from './collapsible'

interface ApplianceSafetyTestProps {
    appliance_key: string
    path: string
    index?: number
}

// Single appliance component
const ApplianceSafetyTest: FC<ApplianceSafetyTestProps> = ({
    appliance_key,
    path,
    index,
}) => {
    return (
        <>
            <RadioWrapper
                label={`Appliance Type:`}
                options={['Gas/Oil Water Heater', 'Gas/Oil Furnace/Boiler']}
                path={`${path}.${appliance_key}.name`}
            />
            <PhotoInputWrapper
                id={`${path}.${appliance_key}.indoor_ambient_air_co_level_photo`}
                label="Indoor ambient air CO level - Photo"
                uploadable={false}
            >
                Indoor ambient air CO level readout photo (if the CO level is
                above 9 PPM look for the source)
            </PhotoInputWrapper>
            <RadioWrapper
                label="Does the ambient CO test pass?"
                options={['Passed', 'Failed', 'Warning', 'N/A']}
                path={`${path}.${appliance_key}.ambient_CO_test`}
            />
        </>
    )
}

// Gas/Oil Furnace/Boiler - Photo prompts and test status questions
const ApplianceSafetyTestFurnaceBoiler: FC<ApplianceSafetyTestProps> = ({
    appliance_key,
    path,
}) => {
    return (
        <>
            <PhotoInputWrapper
                id={`${path}.${appliance_key}.space_heating_appliance_photo`}
                label="Space Heating Appliance - Photo "
                uploadable={false}
            >
                Visually inspect the combustion heating appliance, comment on
                any evidence of unsafe conditions.
            </PhotoInputWrapper>
            <PhotoInputWrapper
                id={`${path}.${appliance_key}.space_heating_pipe_connection_leak_check_photo`}
                label="Pipe Connection Leak Check - Photo"
                uploadable={false}
            >
                * Inspect the accessible section of gas piping, check all
                accessible joints with combustion gas detector, confirm leaks
                with bubble solution, comment if any found * Inspect oil supply
                system, check all accessible tank and line components, comment
                on any leaks or safety issues
            </PhotoInputWrapper>
            <RadioWrapper
                label="Does the gas leak detection test pass?"
                options={['Passed', 'Failed', 'Warning', 'N/A']}
                path={`${path}.${appliance_key}.space_heating_gas_leak_detection_test`}
            />
            <PhotoInputWrapper
                id={`${path}.${appliance_key}.space_heating_appliance_vent_photo`}
                label="Space heating Appliance Vent - Photo"
                uploadable={false}
            >
                Visually inspect the venting system, comment if there is an
                unsafe configuration
            </PhotoInputWrapper>
            <PhotoInputWrapper
                id={`${path}.${appliance_key}.space_heating_appliance_draft_photo`}
                label="Space heating Appliance Draft – Photo"
                uploadable={false}
            >
                Perform test under ANSI/BPI-1200-S-2017 depressurization
                conditions if the appliance is inside the pressure boundary.
            </PhotoInputWrapper>
            <RadioWrapper
                label="Does the spillage test(s) pass?"
                options={['Passed', 'Warning', 'N/A']}
                path={`${path}.${appliance_key}.space_heating_spillage_test`}
            />
            <PhotoInputWrapper
                id={`${path}.${appliance_key}.space_heating_appliance_co_measurement_photo`}
                label="Space heating Appliance CO measurement – Photo "
                uploadable={false}
            >
                * Perform test under ANSI/BPI-1200-S-2017 depressurization
                conditions if the appliance is inside the pressure boundary. *
                Comment if CO levels are above the 200 PPM air free threshold
                limit. * Provide a combustion analyzer readout photo.
            </PhotoInputWrapper>
            <RadioWrapper
                label="Does the undiluted CO test pass?"
                options={['Passed', 'Failed', 'Warning', 'N/A']}
                path={`${path}.${appliance_key}.space_heating_undiluted_CO_test`}
            />{' '}
        </>
    )
}

// Gas/Oil Water Heater - Photo prompts and test status questions
const ApplianceSafetyTestWaterHeater: FC<ApplianceSafetyTestProps> = ({
    appliance_key,
    path,
}) => (
    <>
        <PhotoInputWrapper
            id={`${path}.${appliance_key}.water_heater_photo`}
            label="Water heater - Photo"
            uploadable={false}
        >
            Visually inspect the combustion water heater, comment on any
            evidence of unsafe conditions such as corroded or leaking water
            connections, poorly supported, missing or inadequate seismic
            strapping.
        </PhotoInputWrapper>
        <PhotoInputWrapper
            id={`${path}.${appliance_key}.water_heater_pipe_connection_leak_check_photo`}
            label="Pipe Connection Leak Check - Photo"
            uploadable={false}
        >
            * Inspect the accessible section of gas piping, check all accessible
            joints with combustion gas detector, confirm leaks with bubble
            solution, comment if any found * Inspect oil supply system, check
            all accessible tank and line components, comment on any leaks or
            safety issues
        </PhotoInputWrapper>
        <RadioWrapper
            label="Does the gas leak detection test pass?"
            options={['Passed', 'Failed', 'Warning', 'N/A']}
            path={`${path}.${appliance_key}.water_heater_gas_leak_detection_test`}
        />
        <PhotoInputWrapper
            id={`${path}.${appliance_key}.water_heater_vent_photo`}
            label="Water Heater Vent - Photo"
            uploadable={false}
        >
            Visually inspect the venting system, comment if there is an unsafe
            configuration
        </PhotoInputWrapper>
        <PhotoInputWrapper
            id={`${path}.${appliance_key}.water_heater_draft_photo`}
            label="Water Heater Draft – Photo"
            uploadable={false}
        >
            Perform test under ANSI/BPI-1200-S-2017 depressurization conditions
            if the appliance is inside the pressure boundary.
        </PhotoInputWrapper>
        <RadioWrapper
            label="Does the spillage test(s) pass?"
            options={['Passed', 'Warning', 'N/A']}
            path={`${path}.${appliance_key}.water_heater_spillage_test`}
        />
        <PhotoInputWrapper
            id={`${path}.${appliance_key}.water_heater_co_measurement_photo`}
            label="Water heater CO measurement – Photo "
            uploadable={false}
        >
            * Perform test under ANSI/BPI-1200-S-2017 depressurization
            conditions if the appliance is inside the pressure boundary. *
            Comment if CO levels are above the 200 PPM air free threshold limit.
            * Provide a combustion analyzer readout photo.
        </PhotoInputWrapper>
        <RadioWrapper
            label="Does the undiluted CO test pass?"
            options={['Passed', 'Failed', 'Warning', 'N/A']}
            path={`${path}.${appliance_key}.water_heater_undiluted_CO_test`}
        />{' '}
    </>
)

const CombustionSafetyChecks: FC<{ path: string }> = ({ path }) => {
    const [appliances, setAppliances] = useState<any>({ ['A1']: {} })
    const [appliancesKey, setAppliancesKey] = useState<any[]>(
        Object.keys(appliances),
    )
    const allowedApplianceKeys = ['A1', 'A2', 'A3', 'A4']
    const { projectId } = useParams()
    const db = new PouchDB(dbName)

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
            .on('change', change => {
                // Call fetchAppliances() when a change is detected in DB
                fetchAppliances()
            })
            .on('error', err => {
                console.error('Changes feed error:', err)
            })

        // Clean up the change listener when the component unmounts
        return () => {
            changes.cancel()
        }
    }, [])

    // Handler to add a new appliance form
    const addAppliance = () => {
        const key_index = allowedApplianceKeys.find(
            key => !appliancesKey.includes(key),
        )
        if (!key_index) {
            console.error('No available key index found.')
            return
        }
        setAppliances((prev: any) => ({
            ...prev,
            [key_index]: {},
        }))
        setAppliancesKey((prev: any) => [...prev, key_index])
    }

    // Handler to remove an appliance form
    const removeAppliance = async (appliance_key: string) => {
        const updatedAppliances = Object.fromEntries(
            Object.entries(appliances).filter(
                ([key, _]) => key !== appliance_key,
            ),
        )

        if (!projectId) {
            console.error('projectId is undefined')
            return
        }
        try {
            const doc: any = await db.get(projectId)
            const updatedData = { ...doc.data_, [path]: updatedAppliances }

            if (doc && updatedData) {
                const attachments = doc._attachments

                // Prepare the updated document
                const updatedDoc = {
                    ...doc,
                    data_: updatedData,
                    _rev: doc._rev, // Ensure you include the latest revision
                }

                // Remove the attachments, if any
                attachments &&
                    Object.keys(attachments).map(attachmentId => {
                        if (
                            attachmentId &&
                            attachmentId.includes(path + '.' + appliance_key) &&
                            doc._attachments[attachmentId]
                        ) {
                            delete doc._attachments[attachmentId]
                        }
                    })

                if (updatedDoc)
                    // Save the updated document back to the database
                    await db.put(updatedDoc)

                if (updatedAppliances) setAppliances(updatedAppliances)
                else setAppliances({ ['A1']: {} })
                setAppliancesKey(Object.keys(updatedAppliances))
            }
        } catch (err) {
            console.error('Failed to remove appliance:', err)
        }
    }
    return (
        <div>
            {appliancesKey &&
                appliancesKey.map((appliance_key: string, index: number) => (
                    <div key={appliance_key}>
                        <Collapsible
                            header={`Appliance: ${
                                appliances[appliance_key]?.name
                                    ? appliances[appliance_key]?.name
                                    : ''
                            }`}
                        >
                            <div className="combustion_tests">
                                <ApplianceSafetyTest
                                    appliance_key={appliance_key}
                                    path={path}
                                />
                                <ShowOrHide
                                    visible={
                                        appliances[appliance_key]?.name ===
                                        'Gas/Oil Water Heater'
                                    }
                                >
                                    <ApplianceSafetyTestWaterHeater
                                        appliance_key={appliance_key}
                                        path={path}
                                    />
                                </ShowOrHide>
                                <ShowOrHide
                                    visible={
                                        appliances[appliance_key]?.name ===
                                        'Gas/Oil Furnace/Boiler'
                                    }
                                >
                                    <ApplianceSafetyTestFurnaceBoiler
                                        appliance_key={appliance_key}
                                        path={path}
                                    />
                                </ShowOrHide>
                            </div>

                            <div>
                                <Button
                                    onClick={() =>
                                        removeAppliance(appliance_key)
                                    }
                                    className="remove-button"
                                >
                                    Remove Appliance
                                </Button>
                            </div>
                            <div>&nbsp;</div>
                        </Collapsible>
                    </div>
                ))}
            {appliancesKey.length < 4 && (
                <Button
                    variant="primary"
                    onClick={() => addAppliance()}
                    className="padding"
                >
                    Add more Appliance
                </Button>
            )}
        </div>
    )
}

export default CombustionSafetyChecks
