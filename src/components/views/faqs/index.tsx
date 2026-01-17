import React from 'react'
import { Container } from 'react-bootstrap'
import Layout from '../layouts/default'
import Collapsible from '../../collapsible'
import { TfiImport, TfiExport } from 'react-icons/tfi'

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
                <Collapsible header="How can I back up / download my data?">
                    You can export / download your projects as JSON object from
                    the main project list by clicking the{' '}
                    <TfiImport size={30} /> icon. This allows you to save a
                    specific project&rsquo;s data as a JSON file to your device.
                    This file contains all the information related to that
                    project.
                    <br />
                    <br />
                    Downloading your projects serves as a backup mechanism. If
                    your browser&rsquo;s cache or site data is cleared (either
                    accidentally or due to browser updates/settings), having
                    these downloaded files allows you to restore your projects
                    by importing them back into the application. This is also
                    useful for sharing project data with others or moving it to
                    another device.
                    <br />
                    <br />
                    In the unlikely event that a browser security update affects
                    local storage, you may need to clear your browser data to
                    reset the application. Having your projects downloaded
                    ensures you can easily reload them afterwards.
                    <br />
                    <br />
                    Please note that you must download each project
                    individually.
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
                    Report tab to open the report as a PDF in your browser. If
                    nothing happens when you click &ldquo;Print Report&rdquo;,
                    your browser&rdquo;s pop-up blocker may be preventing the
                    PDF from opening from https://quality-install-tool.pnnl.gov/
                    <br />
                    <b>For desktop browsers:</b>
                    <ol>
                        <li>
                            In Google Chrome, click &ldquo;Print Report&rdquo;
                            and check for a pop-up blocker icon on the right
                            side of the address bar. Click it and allow pop-ups
                            from
                            &ldquo;https://quality-install-tool.pnnl.gov/&rdquo;.
                            You can also enable this via: Settings → Privacy and
                            security → Site settings → Pop-ups and redirects,
                            then add QI Tool under Allowed.
                        </li>
                        <li>
                            In Safari on macOS, go to Safari → Settings
                            (Preferences) → Websites → Pop-up Windows, find your
                            site in the list, and set it to Allow. Then reload
                            the page and click “Print Report” again.
                        </li>
                    </ol>
                    <b>For mobile browsers:</b>
                    <ol>
                        <li>
                            In Chrome on Android, the PDF may open in the same
                            tab. If it appears blocked, open Chrome&rdquo;s menu
                            and go to Settings → Site settings → Pop-ups and
                            redirects, and allow pop-ups for QI Tool site (or
                            enable pop-ups in general).
                        </li>
                        <li>
                            In Safari on iPhone or iPad, adjust pop-up behavior
                            via the iOS Settings app by going to Settings →
                            Safari → Block Pop-Ups and turning this option off
                            if needed, then try “Print Report” again.
                        </li>
                    </ol>
                </Collapsible>
            </Container>
        </Layout>
    )
}

export default FaqsPage
