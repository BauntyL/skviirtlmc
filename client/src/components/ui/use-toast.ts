// Placeholder for use-toast hook
import * as React from "react"

export function useToast() {
    return {
        toasts: [],
        toast: (props: any) => console.log(props),
        dismiss: (id: string) => console.log(id),
    }
}