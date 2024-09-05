import { FC, useEffect, useState } from 'react'
import RadioWrapper from './radio_wrapper'
import { Button } from 'react-bootstrap'
import PhotoInputWrapper from './photo_input_wrapper'
import dbName from './db_details'
import { useParams } from 'react-router-dom'
import PouchDB from 'pouchdb'
import ShowOrHide from './show_or_hide'

interface ApplianceSafetyTestProps {
    index: number
    path: string
}

// Single appliance component
const ApplianceSafetyTest: FC<ApplianceSafetyTestProps> = ({ index, path }) => {
    return (
        <>
            <RadioWrapper
                label={`Appliance ${index + 1}:`}
                options={['Gas/Oil Water Heater', 'Gas/Oil Furnace/Boiler']}
                path={`${path}.appliance${index + 1}.name`}
            />
            <PhotoInputWrapper
                id={`${path}.appliance${
                    index + 1
                }.indoor_ambient_air_co_level_photo`}
                label="Indoor ambient air CO level - Photo"
                uploadable={false}
            >
                Indoor ambient air CO level readout photo (if the CO level is
                above 9 PPM look for the source)
            </PhotoInputWrapper>
            <RadioWrapper
                label="Does the ambient CO test pass?"
                options={['Passed', 'Failed', 'Warning', 'N/A']}
                path={`${path}.appliance${index + 1}.ambient_CO_test`}
            />
        </>
    )
}

// Gas/Oil Furnace/Boiler - Photo prompts and test status questions
const ApplianceSafetyTestFurnaceBoiler: FC<ApplianceSafetyTestProps> = ({
    index,
    path,
}) => (
    <>
        <PhotoInputWrapper
            id={`${path}.appliance${index + 1}.space_heating_appliance_photo`}
            label="Space Heating Appliance - Photo "
            uploadable={false}
        >
            Visually inspect the combustion heating appliance, comment on any
            evidence of unsafe conditions.
        </PhotoInputWrapper>
        <PhotoInputWrapper
            id={`${path}.appliance${
                index + 1
            }.space_heating_pipe_connection_leak_check_photo`}
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
            path={`${path}.appliance${
                index + 1
            }.space_heating_gas_leak_detection_test`}
        />
        <PhotoInputWrapper
            id={`${path}.appliance${
                index + 1
            }.space_heating_appliance_vent_photo`}
            label="Space heating Appliance Vent - Photo"
            uploadable={false}
        >
            Visually inspect the venting system, comment if there is an unsafe
            configuration
        </PhotoInputWrapper>
        <PhotoInputWrapper
            id={`${path}.appliance${
                index + 1
            }.space_heating_appliance_draft_photo`}
            label="Space heating Appliance Draft – Photo"
            uploadable={false}
        >
            Perform test under ANSI/BPI-1200-S-2017 depressurization conditions
            if the appliance is inside the pressure boundary.
        </PhotoInputWrapper>
        <RadioWrapper
            label="Does the spillage test(s) pass?"
            options={['Passed', 'Warning', 'N/A']}
            path={`${path}.appliance${index + 1}.space_heating_spillage_test`}
        />
        <PhotoInputWrapper
            id={`${path}.appliance${
                index + 1
            }.space_heating_appliance_co_measurement_photo`}
            label="Space heating Appliance CO measurement – Photo "
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
            path={`${path}.appliance${
                index + 1
            }.space_heating_undiluted_CO_test`}
        />{' '}
    </>
)

// Gas/Oil Water Heater - Photo prompts and test status questions
const ApplianceSafetyTestWaterHeater: FC<ApplianceSafetyTestProps> = ({
    index,
    path,
}) => (
    <>
        <PhotoInputWrapper
            id={`${path}.appliance${index + 1}.water_heater_photo`}
            label="Water heater - Photo"
            uploadable={false}
        >
            Visually inspect the combustion water heater, comment on any
            evidence of unsafe conditions such as corroded or leaking water
            connections, poorly supported, missing or inadequate seismic
            strapping.
        </PhotoInputWrapper>
        <PhotoInputWrapper
            id={`${path}.appliance${
                index + 1
            }.water_heater_pipe_connection_leak_check_photo`}
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
            path={`${path}.appliance${
                index + 1
            }.water_heater_gas_leak_detection_test`}
        />
        <PhotoInputWrapper
            id={`${path}.appliance${index + 1}.water_heater_vent_photo`}
            label="Water Heater Vent - Photo"
            uploadable={false}
        >
            Visually inspect the venting system, comment if there is an unsafe
            configuration
        </PhotoInputWrapper>
        <PhotoInputWrapper
            id={`${path}.appliance${index + 1}.water_heater_draft_photo`}
            label="Water Heater Draft – Photo"
            uploadable={false}
        >
            Perform test under ANSI/BPI-1200-S-2017 depressurization conditions
            if the appliance is inside the pressure boundary.
        </PhotoInputWrapper>
        <RadioWrapper
            label="Does the spillage test(s) pass?"
            options={['Passed', 'Warning', 'N/A']}
            path={`${path}.appliance${index + 1}.water_heater_spillage_test`}
        />
        <PhotoInputWrapper
            id={`${path}.appliance${
                index + 1
            }.water_heater_co_measurement_photo`}
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
            path={`${path}.appliance${
                index + 1
            }.water_heater_undiluted_CO_test`}
        />{' '}
    </>
)

const CombustionApplianceSafetyTests: FC<{ path: string }> = ({ path }) => {
    const [appliances, setAppliances] = useState<any[]>([0])
    const { projectId } = useParams<{ projectId: string }>()

    // Fetch appliances from the database when component mounts
    useEffect(() => {
        const db = new PouchDB(dbName)
        const fetchAppliances = async () => {
            if (!projectId) {
                console.error('projectId is undefined')
                return
            }
            try {
                const res: any = await db.get(projectId)
                const appliances_data = res.data_[path] || []
                console.log(
                    Object.values(appliances_data).length,
                    appliances.length,
                )
                setAppliances(Object.values(appliances_data))
            } catch (err) {
                console.error('Failed to fetch appliances:', err)
            }
        }
        // DB change listener
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

        fetchAppliances()
    }, [])

    // Handler to add a new appliance form
    const addAppliance = () => {
        setAppliances(prev => [...prev, { id: prev.length }])
    }

    // Handler to remove an appliance form
    const removeAppliance = async (index: number) => {
        const updatedAppliances = appliances.filter((_, i) => i !== index)
        if (!projectId) {
            console.error('projectId is undefined')
            return
        }
        try {
            const db = new PouchDB(dbName)
            const doc: any = await db.get(projectId)
            const updatedData = { ...doc.data_, [path]: updatedAppliances }

            // Prepare the updated document
            const updatedDoc = {
                ...doc,
                data_: updatedData,
                _rev: doc._rev, // Ensure you include the latest revision
            }

            // Save the updated document back to the database
            await db.put(updatedDoc)
            setAppliances(updatedAppliances) // Update state after successful removal
        } catch (err) {
            console.error('Failed to remove appliance:', err)
        }
    }

    return (
        <div>
            {appliances.map((appliance, index) => (
                <div key={index}>
                    <div className="combustion_tests">
                        {/* <Button
                            onClick={() => removeAppliance(index)}
                            className="remove-button"
                        >
                            X
                        </Button> */}
                        <ApplianceSafetyTest index={index} path={path} />
                        <ShowOrHide
                            visible={appliance.name === 'Gas/Oil Water Heater'}
                        >
                            <ApplianceSafetyTestWaterHeater
                                index={index}
                                path={path}
                            />
                        </ShowOrHide>
                        <ShowOrHide
                            visible={
                                appliance.name === 'Gas/Oil Furnace/Boiler'
                            }
                        >
                            <ApplianceSafetyTestFurnaceBoiler
                                index={index}
                                path={path}
                            />
                        </ShowOrHide>
                    </div>
                    <div>&nbsp;</div>
                </div>
            ))}
            <Button onClick={addAppliance} className="padding">
                Add more Appliance
            </Button>
        </div>
    )
}

export default CombustionApplianceSafetyTests
