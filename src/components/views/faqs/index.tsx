import React, { useEffect, useState } from 'react'
import { Container, Accordion } from 'react-bootstrap'
import Layout from '../layouts/default'
import { TfiImport } from 'react-icons/tfi'

const FaqsPage: React.FC = () => {
    const [activeKey, setActiveKey] = useState<string | null | undefined>(null)

    // Handle fragment navigation to open specific section
    useEffect(() => {
        const hash = window.location.hash.substring(1) // Remove #
        if (hash === 'faq-location-mobile') {
            setActiveKey('faq-location-mobile')
        } else if (hash === 'faq-location-desktop') {
            setActiveKey('faq-location-desktop')
        }

        // Scroll to the element if it exists
        if (hash) {
            const element = document.getElementById(hash)
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' })
                }, 100)
            }
        }
    }, [])

    return (
        <Layout>
            <Container className="mt-4">
                <h1>Frequently Asked Questions (FAQs)</h1>
                <hr />
                <Accordion
                    activeKey={activeKey}
                    onSelect={key =>
                        setActiveKey(typeof key === 'string' ? key : null)
                    }
                >
                    <Accordion.Item eventKey="offline">
                        <Accordion.Header>
                            How does the offline feature work?
                        </Accordion.Header>
                        <Accordion.Body>
                            This application is designed to work completely
                            offline. All the data you enter, including project
                            details and photos, is stored directly on your
                            device in your web browser&rsquo;s local storage.
                            This means you can use the app without an internet
                            connection.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="storage">
                        <Accordion.Header>
                            Where is my data stored?
                        </Accordion.Header>
                        <Accordion.Body>
                            Your data is stored in your browser&rsquo;s internal
                            database (IndexedDB). It is not sent to any server
                            automatically. This ensures your data remains
                            private and accessible only to you on your device.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="cache">
                        <Accordion.Header>
                            What happens if I clear my browser cache or data?
                        </Accordion.Header>
                        <Accordion.Body>
                            <strong>Important:</strong> If you clear your
                            browser&rsquo;s site data (which can include
                            cookies, local storage, and IndexedDB), all project
                            information stored in your browser will be
                            permanently deleted. This means your projects in
                            this application could be lost. To avoid accidental
                            loss, we strongly recommend exporting your projects
                            regularly as a backup.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="backup">
                        <Accordion.Header>
                            How can I back up my data?
                        </Accordion.Header>
                        <Accordion.Body>
                            You can export your projects from the main project
                            list. This will save your data as a file on your
                            device, which you can then transfer and import on
                            another device or keep a backup.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="multidevice">
                        <Accordion.Header>
                            Can I use the app on multiple devices?
                        </Accordion.Header>
                        <Accordion.Body>
                            Since data is stored locally on each device, your
                            projects will not automatically sync between
                            devices. To move a project from one device to
                            another, you must export it from the first device
                            and import it on the second.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="photos">
                        <Accordion.Header>
                            How does loading photos work?
                        </Accordion.Header>
                        <Accordion.Body>
                            The primary way to use the Quality Install Tool is
                            to take photos directly from the workflows (e.g., by
                            using the &ldquo;Add Photo&rdquo; button). However,
                            it is also possible to load photos and maintain
                            accurate geolocation and timestamp when transferred
                            from the original device via USB cable to a desktop
                            or laptop computer and adding the photos from that
                            computer.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="phototypes">
                        <Accordion.Header>
                            What photo types are supported?
                        </Accordion.Header>
                        <Accordion.Body>
                            The current version of the tool supports JPEG and
                            HEIC/HEIF formatted photos.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="print">
                        <Accordion.Header>
                            How do I print a report?
                        </Accordion.Header>
                        <Accordion.Body>
                            You can generate a printable PDF report for any
                            Installation. To do this, navigate to the desired
                            Installation in the project&rsquo;s installation
                            list, and click the &ldquo;Print Report&rdquo;
                            button within the Report tab to open the report as a
                            PDF in your browser.
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                        eventKey="faq-location-mobile"
                        id="faq-location-mobile"
                    >
                        <Accordion.Header>
                            How do I enable location access on Android/iOS?
                        </Accordion.Header>
                        <Accordion.Body>
                            <h5>Android:</h5>
                            <ol>
                                <li>
                                    Open <strong>Settings</strong> on your
                                    device
                                </li>
                                <li>
                                    Go to <strong>Apps</strong> or{' '}
                                    <strong>Applications</strong>
                                </li>
                                <li>
                                    Find and tap the{' '}
                                    <strong>Quality Install Tool</strong> app
                                </li>
                                <li>
                                    Tap <strong>Permissions</strong>
                                </li>
                                <li>
                                    Look for <strong>Location</strong>{' '}
                                    permission and enable it
                                </li>
                                <li>
                                    Select{' '}
                                    <strong>
                                        &ldquo;Allow only while using the
                                        app&rdquo;
                                    </strong>{' '}
                                    or <strong>&ldquo;Allow&rdquo;</strong>
                                </li>
                                <li>
                                    Go back to Settings and ensure{' '}
                                    <strong>Location Services</strong> is turned
                                    ON in the System settings
                                </li>
                            </ol>
                            <h5 className="mt-3">iOS:</h5>
                            <ol>
                                <li>
                                    Open <strong>Settings</strong> on your
                                    device
                                </li>
                                <li>
                                    Scroll down and tap <strong>Privacy</strong>
                                </li>
                                <li>
                                    Tap <strong>Location Services</strong>
                                </li>
                                <li>
                                    Make sure <strong>Location Services</strong>{' '}
                                    is toggled <strong>ON</strong>
                                </li>
                                <li>
                                    Scroll down to find{' '}
                                    <strong>Quality Install Tool</strong>
                                </li>
                                <li>
                                    Tap it and select{' '}
                                    <strong>
                                        &ldquo;While Using the App&rdquo;
                                    </strong>{' '}
                                    or <strong>&ldquo;Always&rdquo;</strong>
                                </li>
                                <li>
                                    Return to the app and try taking a photo
                                    again
                                </li>
                            </ol>
                            <p className="mt-3 text-muted">
                                <strong>Note:</strong> For the most accurate
                                location data, enable GPS on your device before
                                taking photos. Also, make sure the photo
                                metadata (EXIF data) is not being stripped when
                                transferring files.
                            </p>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item
                        eventKey="faq-location-desktop"
                        id="faq-location-desktop"
                    >
                        <Accordion.Header>
                            How do I enable location access on Desktop/Browser?
                        </Accordion.Header>
                        <Accordion.Body>
                            <h5>For Desktop Browsers:</h5>
                            <p>
                                When you grant location access to the Quality
                                Install Tool, your browser may request
                                permission the first time you try to take a
                                photo or access location data. Here&rsquo;s how
                                to handle it:
                            </p>
                            <ol>
                                <li>
                                    When a{' '}
                                    <strong>location request popup</strong>{' '}
                                    appears, click{' '}
                                    <strong>&ldquo;Allow&rdquo;</strong> or{' '}
                                    <strong>&ldquo;Share&rdquo;</strong>
                                </li>
                                <li>
                                    If you accidentally blocked it, you may need
                                    to clear the permission:
                                    <ul className="mt-2">
                                        <li>
                                            <strong>Chrome/Edge:</strong> Click
                                            the lock icon in the address bar,
                                            then find Location and reset it to
                                            &ldquo;Ask (default)&rdquo;
                                        </li>
                                        <li>
                                            <strong>Firefox:</strong> Click the
                                            lock icon, then click the arrow next
                                            to the site name, find Location and
                                            reset it
                                        </li>
                                        <li>
                                            <strong>Safari:</strong> Go to{' '}
                                            <strong>Safari</strong> &gt;{' '}
                                            <strong>Settings</strong> &gt;{' '}
                                            <strong>Privacy</strong> and manage
                                            site settings for location
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    After allowing, refresh the page and try
                                    uploading photos again
                                </li>
                            </ol>
                            <h5 className="mt-3">
                                If Location Still Doesn&rsquo;t Work:
                            </h5>
                            <ul>
                                <li>
                                    Make sure <strong>Location Services</strong>{' '}
                                    is enabled in your operating system:
                                    <ul className="mt-2">
                                        <li>
                                            <strong>Windows:</strong> Settings
                                            &gt; Privacy &amp; Security &gt;
                                            Location &gt; Location services
                                            should be ON
                                        </li>
                                        <li>
                                            <strong>macOS:</strong> System
                                            Preferences &gt; Security &amp;
                                            Privacy &gt; Location Services
                                            should be enabled
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    Check if your browser has location access
                                    permissions in your OS settings
                                </li>
                                <li>
                                    You can still upload photos without location
                                    data &mdash; the app will note that location
                                    was unavailable
                                </li>
                            </ul>
                            <h5 className="mt-3">
                                Uploading Photos with Location from Mobile:
                            </h5>
                            <p>
                                For the best results, consider taking photos
                                directly on your mobile device where location is
                                easier to access. If you transfer photos to a
                                desktop computer via USB:
                            </p>
                            <ol>
                                <li>
                                    Make sure the photos retain their{' '}
                                    <strong>EXIF metadata</strong> (which
                                    includes location data)
                                </li>
                                <li>
                                    Do not strip or remove metadata when
                                    transferring files
                                </li>
                                <li>
                                    Upload the photos directly without editing
                                    or reprocessing them
                                </li>
                            </ol>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
        </Layout>
    )
}

export default FaqsPage
