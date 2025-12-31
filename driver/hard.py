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

import getpass
import os
import time
from secrets import choice

import psutil


class ConnectionManager:
    def passphrase_generator(self, lent=16):
        retndata = "".join(choice("ABCDEF0123456789") for i in range(lent))
        return retndata


class ProcessHandler:
    def __init__(self, prociden):
        self.prociden = prociden

    def return_process_info(self):
        procstmp = psutil.Process(self.prociden).as_dict()
        retndata = {
            "pid": procstmp["pid"],
            "username": procstmp["username"],
            "uids": {
                "real": procstmp["uids"].real,
                "effective": procstmp["uids"].effective,
                "saved": procstmp["uids"].saved
            },
            "memory_percent": procstmp["memory_percent"],
            "name": procstmp["name"],
            "create_time": time.ctime(procstmp["create_time"]),
            "num_ctx_switches": {
                "voluntary": procstmp["num_ctx_switches"].voluntary,
                "involuntary": procstmp["num_ctx_switches"].involuntary,
            },
            "cpu_percent": procstmp["cpu_percent"],
            "cpu_times": {
                "user": procstmp["cpu_times"].user,
                "system": procstmp["cpu_times"].system,
                "children_user": procstmp["cpu_times"].children_user,
                "children_system": procstmp["cpu_times"].children_system,
                "iowait": procstmp["cpu_times"].iowait,
            },
            "memory_info": {
                "rss": procstmp["memory_info"].rss,
                "vms": procstmp["memory_info"].vms,
                "shared": procstmp["memory_info"].shared,
                "text": procstmp["memory_info"].text,
                "lib": procstmp["memory_info"].lib,
                "data": procstmp["memory_info"].data,
                "dirty": procstmp["memory_info"].dirty,
            },
            "status": procstmp["status"],
            "num_threads": procstmp["num_threads"],
            "gids": {
                "real": procstmp["gids"].real,
                "effective": procstmp["gids"].effective,
                "saved": procstmp["gids"].saved,
            },
            "terminal": procstmp["terminal"]
        }
        return retndata

    def get_single_process(self):
        try:
            return psutil.Process(int(self.prociden))
        except Exception as e:
            return str(e)

    def process_killer(self):
        singproc = self.get_single_process()
        if type(singproc) == psutil.Process:
            singproc.kill()
        return {"retnmesg": True}

    def process_terminator(self):
        singproc = self.get_single_process()
        if type(singproc) == psutil.Process:
            singproc.terminate()
        return {"retnmesg": True}

    def process_suspender(self):
        singproc = self.get_single_process()
        if type(singproc) == psutil.Process:
            singproc.suspend()
        return {"retnmesg": True}

    def process_resumer(self):
        singproc = self.get_single_process()
        if type(singproc) == psutil.Process:
            singproc.resume()
        return {"retnmesg": True}


class LiveUpdatingElements:
    def get_virtual_memory_data(self):
        bruhdata = psutil.virtual_memory()
        retndata = {
            "total": bruhdata.total,
            "available": bruhdata.available,
            "percent": bruhdata.percent,
            "used": bruhdata.used,
            "active": getattr(bruhdata, 'active', 0),
            "inactive": getattr(bruhdata, 'inactive', 0),
            "buffers": getattr(bruhdata, 'buffers', 0),
            "cached": getattr(bruhdata, 'cached', 0),
            "shared": getattr(bruhdata, 'shared', 0),
            "slab": getattr(bruhdata, 'slab', 0),
        }
        return retndata

    def get_swap_memory_info(self):
        swapinfo = psutil.swap_memory()
        retndata = {
            "total": swapinfo.total,
            "used": swapinfo.used,
            "free": swapinfo.free,
            "percent": swapinfo.percent,
            "sin": swapinfo.sin,
            "sout": swapinfo.sout,
        }
        return retndata

    def get_cpu_state_times(self):
        timedata = psutil.cpu_times(percpu=True)
        retndata = {}
        for indx in range(len(timedata)):
            t = timedata[indx]
            elemobjc = {
                "user": t.user,
                "nice": getattr(t, 'nice', 0),
                "system": t.system,
                "idle": t.idle,
                "iowait": getattr(t, 'iowait', 0),
                "irq": getattr(t, 'irq', 0),
                "softirq": getattr(t, 'softirq', 0),
                "steal": getattr(t, 'steal', 0),
                "guest": getattr(t, 'guest', 0),
                "guest_nice": getattr(t, 'guest_nice', 0),
            }
            retndata[indx] = elemobjc
        return retndata

    def get_cpu_usage_percent(self):
        cpuprcnt = psutil.cpu_percent(percpu=True)
        retndata = {}
        for indx in range(len(cpuprcnt)):
            retndata[indx] = cpuprcnt[indx]
        return retndata

    def get_cpu_statistics(self):
        cpustats = psutil.cpu_stats()
        retndata = {
            "ctx_switches": cpustats.ctx_switches,
            "interrupts": cpustats.interrupts,
            "soft_interrupts": cpustats.soft_interrupts,
            "syscalls": cpustats.syscalls,
        }
        return retndata

    def get_cpu_clock_speed(self):
        cpuclock = psutil.cpu_freq(percpu=True)
        retndata = {}
        for indx in range(len(cpuclock)):
            singlist = {
                "current": cpuclock[indx].current,
                "min": cpuclock[indx].min,
                "max": cpuclock[indx].max,
            }
            retndata[indx] = singlist
        return retndata

    def get_disk_io_usage(self):
        diousage = psutil.disk_io_counters(perdisk=True)
        retndata = {}
        for indx in diousage.keys():
            disk = diousage[indx]
            singlist = {
                "read_count": disk.read_count,
                "write_count": disk.write_count,
                "read_bytes": disk.read_bytes,
                "write_bytes": disk.write_bytes,
                "read_time": disk.read_time,
                "write_time": disk.write_time,
                "read_merged_count": getattr(disk, 'read_merged_count', 0),
                "write_merged_count": getattr(disk, 'write_merged_count', 0),
                "busy_time": getattr(disk, 'busy_time', 0),
            }
            retndata[indx] = singlist
        return retndata

    def get_network_io_usage(self):
        netusage = psutil.net_io_counters(pernic=True)
        retndata = {}
        for indx in netusage.keys():
            singlist = {
                "bytes_sent": netusage[indx].bytes_sent,
                "bytes_recv": netusage[indx].bytes_recv,
                "packets_sent": netusage[indx].packets_sent,
                "packets_recv": netusage[indx].packets_recv,
                "errin": netusage[indx].errin,
                "errout": netusage[indx].errout,
                "dropin": netusage[indx].dropin,
                "dropout": netusage[indx].dropout,
            }
            retndata[indx] = singlist
        return retndata

    def get_process_listing_info(self):
        procstmp = psutil.process_iter(["pid", "name", "username", "memory_percent", "cpu_percent"])
        retndata = {}
        for indx in procstmp:
            singlist = {
                "pid": indx.info["pid"],
                "name": indx.info["name"],
                "username": indx.info["username"],
                "memory_percent": indx.info["memory_percent"],
                "cpu_percent": indx.info["cpu_percent"],
            }
            retndata[indx.info["pid"]] = singlist
        return retndata

    def get_sensors_temperature(self):
        retndata = {}
        if not hasattr(psutil, 'sensors_temperatures'):
            return retndata
        try:
            senstemp = psutil.sensors_temperatures(fahrenheit=False)
            for indx in senstemp.keys():
                retndata[indx] = []
                for jndx in senstemp[indx]:
                    singdict = {
                        "label": jndx.label,
                        "current": str(jndx.current),
                        "high": str(jndx.high),
                        "critical": str(jndx.critical),
                    }
                    retndata[indx].append(singdict)
        except:
            pass
        return retndata

    def get_sensors_fan_speed(self):
        retndata = {}
        if not hasattr(psutil, 'sensors_fans'):
            return retndata
        try:
            senstemp = psutil.sensors_fans()
            for indx in senstemp.keys():
                retndata[indx] = []
                for jndx in senstemp[indx]:
                    singdict = {
                        "label": jndx.label,
                        "current": jndx.current
                    }
                    retndata[indx].append(singdict)
        except:
            pass
        return retndata

    def get_sensors_battery_status(self):
        retndata = {}
        try:
            battstat = psutil.sensors_battery()
            retndata = {
                "percent": battstat.percent,
                "secsleft": battstat.secsleft,
                "power_plugged": battstat.power_plugged,
            }
        except:
            retndata = {
                "percent": 0,
                "secsleft": 0,
                "power_plugged": True,
            }
        return retndata

    def return_live_data(self):
        jsonobjc = {
            "virtdata": self.get_virtual_memory_data(),
            "swapinfo": self.get_swap_memory_info(),
            "cpustats": self.get_cpu_statistics(),
            "cputimes": self.get_cpu_state_times(),
            "cpuprcnt": self.get_cpu_usage_percent(),
            "cpuclock": self.get_cpu_clock_speed(),
            "diousage": self.get_disk_io_usage(),
            "netusage": self.get_network_io_usage(),
            "procinfo": self.get_process_listing_info(),
            "sensread": {
                "senstemp": self.get_sensors_temperature(),
                "fanspeed": self.get_sensors_fan_speed(),
                "battstat": self.get_sensors_battery_status(),
            }
        }
        return jsonobjc


class DeadUpdatingElements(LiveUpdatingElements):
    def get_os_uname_data(self):
        unamdata = os.uname()
        retndata = {
            "System name": unamdata.sysname + " " + unamdata.release,
            "Host name": unamdata.nodename + " [" + unamdata.machine + "] ",
            "Version": unamdata.version,
            "Username": getpass.getuser(),
        }
        return retndata

    def get_cpu_logical_count(self):
        cpuquant = psutil.cpu_count(logical=True)
        return str(cpuquant)

    def get_all_disk_partitions(self):
        diskpart = psutil.disk_partitions(all=True)
        retndata = []
        for indx in diskpart:
            singinfo = {
                "device": indx.device,
                "mountpoint": indx.mountpoint,
                "fstype": indx.fstype,
                "opts": indx.opts,
            }
            retndata.append(singinfo)
        return retndata

    def get_network_statistics(self):
        netstats = psutil.net_if_stats()
        retndata = {}
        for indx in netstats.keys():
            singinfo = {
                "isup": netstats[indx].isup,
                "duplex": netstats[indx].duplex,
                "speed": netstats[indx].speed,
                "mtu": netstats[indx].mtu,
            }
            retndata[indx] = singinfo
        return retndata

    def get_network_if_addresses(self):
        netaddrs = psutil.net_if_addrs()
        retndata = {}
        for indx in netaddrs.keys():
            retndata[indx] = {}
            for jndx in netaddrs[indx]:
                addrobjc = {
                    "address": jndx.address,
                    "netmask": jndx.netmask,
                    "broadcast": jndx.broadcast,
                    "ptp": jndx.ptp,
                }
                retndata[indx][jndx.family] = addrobjc
        return retndata

    def get_boot_time(self):
        boottime = time.ctime(psutil.boot_time())
        return boottime

    def return_dead_data(self):
        jsonobjc = {
            "osnmdata": self.get_os_uname_data(),
            "cpuquant": self.get_cpu_logical_count(),
            "cpuclock": self.get_cpu_clock_speed(),
            "diskpart": self.get_all_disk_partitions(),
            "diousage": self.get_disk_io_usage(),
            "netusage": self.get_network_io_usage(),
            "netaddrs": self.get_network_if_addresses(),
            "netstats": self.get_network_statistics(),
            "boottime": self.get_boot_time(),
            "procinfo": self.get_process_listing_info(),
            "sensread": {
                "senstemp": self.get_sensors_temperature(),
                "fanspeed": self.get_sensors_fan_speed(),
                "battstat": self.get_sensors_battery_status()
            }
        }
        return jsonobjc