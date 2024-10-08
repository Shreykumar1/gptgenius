import NewTour from '@/components/NewTour'
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'

const NewTourPage = async () => {
  const queryClient = new QueryClient() ;
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <NewTour />
    </HydrationBoundary>
  )
}

export default NewTourPage