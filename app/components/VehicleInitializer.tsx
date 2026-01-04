"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserVehiclesQuery } from '@/app/beService/user-service'
import { setVehicles } from '@/app/store/slices/vehicleSlice'
import { RootState } from '@/app/store/store'

export const VehicleInitializer = () => {
    const dispatch = useDispatch()
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)
    const { data, isSuccess } = useGetUserVehiclesQuery(undefined, {
        skip: !isAuthenticated
    })

    useEffect(() => {
        if (isSuccess && data?.vehicles) {
            dispatch(setVehicles(data.vehicles))
        }
    }, [isSuccess, data, dispatch])

    return null
}
