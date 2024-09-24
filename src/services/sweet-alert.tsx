import Swal from 'sweetalert2'

export async function toast(type: string, msg: string) {
    // it is a promise
    return Swal.fire({
        position: "top-end",
        icon: type,
        showConfirmButton: false,
        timer: 3000,
        toast: true,
        title: msg
    })
}