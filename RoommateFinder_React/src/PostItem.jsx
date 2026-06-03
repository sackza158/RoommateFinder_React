function PostItem(props){
    return(
        <div className="post-item">
            <p>ชื่อหอพัก : {props.post.title}</p>
            <p className="price">ราคา : {props.post.price}/เดือน</p>
            <p>รายละเอียด : {props.post.description}</p>
            <p>ประเภท : {props.post.roomtype}</p>

            <button onClick={() => props.onEdit(props.post)}>
                แก้ไข
            </button>

            <button onClick={() => props.onDelete(props.post.id)}>
                ลบ
            </button>

        </div>
    );
}

export default PostItem;