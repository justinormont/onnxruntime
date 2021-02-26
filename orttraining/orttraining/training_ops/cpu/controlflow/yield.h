// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

#pragma once

#include "core/common/common.h"
#include "core/framework/op_kernel.h"

namespace onnxruntime {
namespace contrib {

class YieldOp final : public OpKernel {
 public:
  YieldOp(const OpKernelInfo& info) : OpKernel(info) {}
  Status Compute(OpKernelContext* context) const override;
  static bool input_;
};

}  // namespace contrib
}  // namespace onnxruntime
