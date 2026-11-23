#!/usr/bin/env python3
"""Cut the subject (people and pets) out of a photo with macOS Vision, the same lift Photos uses.

Writes a greyscale mask, white = subject, for scripts/ben-grid.py. Needs macOS 14+ and
pyobjc-framework-Vision and pyobjc-framework-Quartz (pip, a throwaway venv is fine).

  python scripts/ben-lift.py CROPPED_PHOTO MASK.png
"""
import sys
import Vision, Quartz
from Foundation import NSURL
src, out = sys.argv[1], sys.argv[2]
ci = Quartz.CIImage.imageWithContentsOfURL_(NSURL.fileURLWithPath_(src))
req = Vision.VNGenerateForegroundInstanceMaskRequest.alloc().init()
h = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(ci, {})
ok, err = h.performRequests_error_([req], None)
assert ok, err
res = req.results()
assert res and len(res), "no subject"
r = res[0]
print("instances", len(r.allInstances()))
buf, err = r.generateScaledMaskForImageForInstances_fromRequestHandler_error_(r.allInstances(), h, None)
assert buf is not None, err
m = Quartz.CIImage.imageWithCVPixelBuffer_(buf)
ctx = Quartz.CIContext.contextWithOptions_(None)
cs = Quartz.CGColorSpaceCreateDeviceGray()
ctx.writePNGRepresentationOfImage_toURL_format_colorSpace_options_error_(m, NSURL.fileURLWithPath_(out), Quartz.kCIFormatL8, cs, {}, None)
print("ok")
