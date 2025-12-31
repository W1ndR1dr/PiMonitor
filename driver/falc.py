"""
##########################################################################
*
*   Copyright © 2019-2020 Akashdeep Dhar <t0xic0der@fedoraproject.org>
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <https://www.gnu.org/licenses/>.
*
##########################################################################
"""

import json
import os
import mimetypes

import click
import falcon
from falcon import __version__ as flcnvers
from hard import (
    ConnectionManager,
    DeadUpdatingElements,
    LiveUpdatingElements,
    ProcessHandler,
)
from psutil import __version__ as psutvers
from werkzeug import serving
try:
    from werkzeug import __version__ as wkzgvers
except ImportError:
    import importlib.metadata
    wkzgvers = importlib.metadata.version('werkzeug')


class LiveUpdatingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = LiveUpdatingElements().return_live_data()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class DeadUpdatingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = DeadUpdatingElements().return_dead_data()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class ProcessHandlingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = ProcessHandler(int(rqst.get_param("prociden"))).return_process_info()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class ProcessKillingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = ProcessHandler(int(rqst.get_param("prociden"))).process_killer()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class ProcessTerminatingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = ProcessHandler(int(rqst.get_param("prociden"))).process_terminator()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class ProcessSuspendingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = ProcessHandler(int(rqst.get_param("prociden"))).process_suspender()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class ProcessResumingEndpoint(object):
    def __init__(self, passcode):
        self.passcode = passcode

    def on_get(self, rqst, resp):
        passcode = rqst.get_param("passcode")
        if passcode == self.passcode:
            retnjson = ProcessHandler(int(rqst.get_param("prociden"))).process_resumer()
        else:
            retnjson = {"retnmesg": "deny"}
        resp.text = json.dumps(retnjson, ensure_ascii=False)
        resp.set_header("Access-Control-Allow-Origin", "*")
        resp.status = falcon.HTTP_200


class StaticFileHandler:
    def __init__(self, static_dir):
        self.static_dir = static_dir

    def on_get(self, req, resp, filepath='index.html'):
        if not filepath:
            filepath = 'index.html'

        full_path = os.path.join(self.static_dir, filepath)

        # Security: prevent path traversal
        if not os.path.abspath(full_path).startswith(os.path.abspath(self.static_dir)):
            resp.status = falcon.HTTP_403
            return

        if not os.path.exists(full_path):
            # Serve index.html for SPA routing
            full_path = os.path.join(self.static_dir, 'index.html')

        if os.path.exists(full_path) and os.path.isfile(full_path):
            content_type, _ = mimetypes.guess_type(full_path)
            resp.content_type = content_type or 'application/octet-stream'
            with open(full_path, 'rb') as f:
                resp.data = f.read()
            resp.status = falcon.HTTP_200
        else:
            resp.status = falcon.HTTP_404


main = falcon.API()


@click.command()
@click.option("-p", "--portdata", "portdata", help="Set the port value [0-65536].", default="4040")
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address.")
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address.")
@click.option("-c", "--passcode", "fixedpass", help="Use a fixed passcode instead of random.", default=None)
@click.version_option(version="1.0.1", prog_name=click.style("SuperVisor Driver Service", fg="magenta"))
def mainfunc(portdata, netprotc, fixedpass):
    click.echo(" * " + click.style("SuperVisor Driver Service v1.0.1", fg="green"))
    netpdata = ""
    passcode = fixedpass if fixedpass else ConnectionManager().passphrase_generator()
    if netprotc == "ipprotv6":
        click.echo(" * " + click.style("IP version       ", fg="magenta") + ": " + "6")
        netpdata = "::"
    elif netprotc == "ipprotv4":
        click.echo(" * " + click.style("IP version       ", fg="magenta") + ": " + "4")
        netpdata = "0.0.0.0"
    click.echo(" * " + click.style("Passcode         ", fg="magenta") + ": " + passcode + "\n" +
               " * " + click.style("Reference URI    ", fg="magenta") + ": " + "http://" + netpdata + ":" + portdata +
               "/" + "\n" +
               " * " + click.style("Monitor service  ", fg="magenta") + ": " + "Psutil v" + psutvers + "\n" +
               " * " + click.style("Endpoint service ", fg="magenta") + ": " + "Falcon v" + flcnvers + "\n" +
               " * " + click.style("HTTP server      ", fg="magenta") + ": " + "Werkzeug v" + wkzgvers)
    livesync = LiveUpdatingEndpoint(passcode)
    deadsync = DeadUpdatingEndpoint(passcode)
    procinfo = ProcessHandlingEndpoint(passcode)
    killproc = ProcessKillingEndpoint(passcode)
    termproc = ProcessTerminatingEndpoint(passcode)
    suspproc = ProcessSuspendingEndpoint(passcode)
    resmproc = ProcessResumingEndpoint(passcode)
    main.add_route("/livesync", livesync)
    main.add_route("/deadsync", deadsync)
    main.add_route("/procinfo", procinfo)
    main.add_route("/killproc", killproc)
    main.add_route("/termproc", termproc)
    main.add_route("/suspproc", suspproc)
    main.add_route("/resmproc", resmproc)

    # Serve static frontend files
    script_dir = os.path.dirname(os.path.abspath(__file__))
    static_dir = os.path.join(script_dir, '..', 'frontend', 'dist')
    if os.path.exists(static_dir):
        static = StaticFileHandler(static_dir)
        main.add_route("/", static)
        main.add_route("/assets/{filepath}", static)
        main.add_route("/{filepath}", static)
        click.echo(" * " + click.style("Frontend         ", fg="magenta") + ": " + "Enabled")

    serving.run_simple(netpdata, int(portdata), main)


if __name__ == "__main__":
    mainfunc()
