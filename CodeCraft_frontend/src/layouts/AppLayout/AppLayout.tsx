import { useEffect, useState, type ReactNode } from "react";
import { lazy, Suspense } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAppStore from "@/shared/stores/useAppStore"
import useOpenElement from "@/shared/hooks/useOpenElement"
import Header from "./components/header/Header"
import Sidebar from "./components/sidebar/Sidebar"
import Modal from "@/shared/components/modal/Modal"
import AppNotification from "@/shared/components/feedback/app-notification/AppNotification";


const ProjectForm = lazy(() =>
  import("@/modules/projects/components/project-form/ProjectForm")
)

const TaskForm = lazy(() =>
  import("@/modules/tasks/components/task-form/TaskForm")
)

const TaskDetails = lazy(() =>
  import("@/modules/tasks/views/task-details/TaskDetails")
)

const FloatingActionMenu = lazy(() =>
  import("@/shared/components/floating-action-menu/FloatingActionMenu")
)

import './AppLayout.scss'
import { initBreakpoints } from "@/shared/utils/breakpoint";
import useAuth from "@/modules/auth/hooks/useAuth";
import { Loading } from "@/shared/components/loading/Loading";
import ErrorState from "@/shared/components/errors/error-state/ErrorState";

export default function AppLayout() {

  // 1. Hooks de React Router

  const location = useLocation()
  const navigate = useNavigate()

   // 2. Estado global (Zustand, Redux, Context, etc.)

  const { openModal, isOpenModal, closeModal, isTabletTwo } = useAppStore()
  
  // 3. Custom hooks

  const { isOpen : openMenu, handleOpenElement : handleOpenMenu, closeElement : closeMenu } = useOpenElement()

  //Fijarse en esto porque se ejecuta cada vez que hago un cambio en un subcomponente
  const { data, error, isError, isLoading } = useAuth()

  // 4. Estado local
  
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  // 5. Valores derivados
  const params = new URLSearchParams(location.search)
  const modalType = params.get("modalType")
  const taskId = params.get("taskId")
  
  const scrollKey : string | undefined = modalType === 'task' && taskId ? taskId : undefined

  // 6. Effects

  useEffect(() => {
    const cleanup = initBreakpoints()
    return cleanup
  }, [])

  useEffect(() => {
    if (!modalType) {
      setModalContent(null);
      closeModal();
      return;
    }

    switch (modalType) {
      case 'newProyect':
        setModalContent(<ProjectForm  />)
        openModal()
        break


      case 'newTask':
        setModalContent(<TaskForm />)
        openModal()
        break

      case "task":
        if (taskId) {
          setModalContent(<TaskDetails taskId={taskId} />); 
          openModal()
        }
        break

      default:
        setModalContent(null);
        closeModal()
    }
  }, [location.search])

  // 7. Handlers
  const handleCloseModal = () => {
    navigate(location.pathname)
  }

  if(isLoading) return <Loading />

  if(isError && error) {
    console.log("kind: ", error.kind, "status: ", error.status, "mensaje: ", error.message)
    
    if(error.kind === 'auth') {
      return <Navigate to='/auth/login' />
    }


    return <ErrorState type="unknown" />
    
  }

  if(data) return (
    <div className="layout">
      <Header 
        openMenu={openMenu}
        handleOpenMenu={handleOpenMenu}
        user={data}
      />
      <main className='main'>
        <Sidebar 
          isOpen={openMenu}
          closeMenu={closeMenu}
        />
        
        <div className="main__content">
          <Outlet context={{ user: data }}/>
        </div>

        <Modal 
          isOpen= {isOpenModal} 
          onClose={handleCloseModal}
          scrollKey={scrollKey}
        > 
          <Suspense>
            {modalContent}
          </Suspense>
        </Modal>

        <AppNotification />  
        
        {
          !isTabletTwo &&
          <FloatingActionMenu />
        }
        
      </main>
    </div>
  )
}
