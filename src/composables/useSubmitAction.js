import ref from 'vue'

export function useSubmitAction(actionFn) {
        const isSubmitting = ref(false)

        const execute = async (...args) => {
            if (isSubmitting.value) return
            
            isSubmitting.value = true
            try {
                return await actionFn(...args)
            } finally {
                isSubmitting.value = false
            }
        }
        
        return {
            isSubmitting,
            execute
        }
}
