<template>
<div class="modal fade" tabindex="-1" aria-labelledby="tokenApprovalModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="tokenApprovalModalLabel">Approve {{ token?.symbol }} token</h1>
        <button id="closeTokenApprovalModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">

        Approve {{ token?.symbol }} tokens for swapping:

        <div class="row mt-3">
          <div class="col-lg-8">

            <!-- Unlimited choice -->
            <div class="input-group" @click="selectOption('unlimited')">
              <div class="input-group-text">
                <input class="form-check-input mt-0" type="radio" :checked="isUnlimited" />
              </div>

              <input value="Unlimited" type="text" class="form-control" disabled />
            </div>

            <!-- Limited choice -->
            <div class="input-group mt-2" @click="selectOption('limited')">
              <div class="input-group-text">
                <input class="form-check-input mt-0" type="radio" :checked="!isUnlimited" />
              </div>

              <input v-model="approvalAmount" type="text" class="form-control" />

              <span class="input-group-text" id="basic-addon2">{{ token?.symbol }}</span>
            </div>
          </div>

        </div>

        <p class="mt-3">
          <small>
            <em>
              If you want to do more swaps without approvals, set a big enough amount or choose unlimited.
            </em>
          </small>
        </p>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="approveToken">
          <span v-if="waiting" class="spinner-border spinner-border-sm mx-1" role="status" aria-hidden="true"></span>
          
          <span v-if="isUnlimited">Approve unlimited</span>
          <span v-if="!isUnlimited">Approve {{ approvalAmount }} {{ token?.symbol }}</span>

        </button>
      </div>

    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'TokenApprovalModal',
  props: ["token", "amount"],

  data() {
    return {
      waiting: false,
      selectedOption: "unlimited",
      approvalAmount: 0
    }
  },

  mounted() {
    this.approvalAmount = this.amount;
  },

  computed: {
    isUnlimited() {
      return this.selectedOption === "unlimited";
    }
  },

  methods: {
    selectOption(option) {
      this.selectedOption = option;
    },
  },

  watch: {
    amount(newVal, oldVal) {
      if (newVal) {
        this.approvalAmount = this.amount;
      }
    }
  }
}
</script>
