import React from 'react'
import { Container } from 'react-bootstrap'
import Layout from '../layouts/default'
import Collapsible from '../../collapsible'

const FaqsPage: React.FC = () => {
    return (
        <Layout>
            <Container className="mt-4">
                <h1>Frequently Asked Questions (FAQs)</h1>
                <hr />
                <Collapsible header="How does the offline feature work?">
                    This application is designed to work completely offline. All
                    the data you enter, including project details and photos, is
                    stored directly on your device in your web browser&rsquo;s
                    local storage. This means you can use the app without an
                    internet connection.
                </Collapsible>
                <Collapsible header="Where is my data stored?">
                    Your data is stored in your browser&rsquo;s internal
                    database (IndexedDB). It is not sent to any server
                    automatically. This ensures your data remains private and
                    accessible only to you on your device.
                </Collapsible>
                <Collapsible header="What happens if I clear my browser cache or data?">
                    <strong>Important:</strong> If you clear your browser’s site
                    data (which can include cookies, local storage, and
                    IndexedDB), all project information stored in your browser
                    will be permanently deleted. This means your projects in
                    this application could be lost. To avoid accidental loss, we
                    strongly recommend exporting your projects regularly as a
                    backup.
                </Collapsible>
                <Collapsible header="How can I back up my data?">
                    You can export your projects from the main project list.
                    This will save your data as a file on your device, which you
                    can then transfer and import on another device or keep a
                    backup.
                </Collapsible>
                <Collapsible header="Can I use the app on multiple devices?">
                    Since data is stored locally on each device, your projects
                    will not automatically sync between devices. To move a
                    project from one device to another, you must export it from
                    the first device and import it on the second.
                </Collapsible>
                <Collapsible header="How does loading photos work?">
                    The primary way to use the Quality Install Tool is to take
                    photos directly from the workflows (e.g., by using the “Add
                    Photo” button). However, it is also possible to load photos
                    and maintain accurate geolocation and timestamp when
                    transferred from the original device via USB cable to a
                    desktop or laptop computer and adding the photos from that
                    computer.
                </Collapsible>
                <Collapsible header="What photo types are supported?">
                    The current version of the tool supports JPEG and HEIC/HEIF
                    formatted photos.
                </Collapsible>
                <Collapsible header="How do I print a report?">
                    You can generate a printable PDF report for any
                    Installation. To do this, navigate to the desired
                    Installation in the project&rsquo;s installation list, and
                    click the &ldquo;Print Report&rdquo; button within the
                    Report tab to open the report as a PDF in your browser.
                </Collapsible>
            </Container>
        </Layout>
    )
}

export default FaqsPage
